import { Client } from "@stomp/stompjs";
import { SOCKET_STATUS } from "../utils/eventTypes";

const BROKER_URL = import.meta.env.DEV
  ? import.meta.env.VITE_WS_LOCAL_URL
  : import.meta.env.VITE_WS_URL;

class SocketClient {
  client = null;
  roomSubscription = null;
  errorSubscription = null;

  roomCode = null;
  participantId = null;

  eventListeners = new Set();
  errorListeners = new Set();
  statusListeners = new Set();
  connectedListeners = new Set();

  /**
   * WebSocket(STOMP) 연결을 열고, 성공하면 방 topic과 개인 오류 큐를 자동 구독한다.
   * 컴포넌트에서 직접 부르기보다 useRoomSocket({ roomCode, participantId })를 통해 쓰는 것을 권장한다
   * (연결 해제와 리스너 정리를 훅이 대신 해준다).
   * 같은 roomCode + participantId로 다시 호출하면 무시되므로, 페이지 재진입 시 안전하게 재호출할 수 있다.
   * @param {{roomCode: String, participantId: Number}} params
   * @example
   * await socketClient.connect({ roomCode: "1234", participantId: 1 });
   */
  async connect({ roomCode, participantId }) {
    // 같은 방에 이미 연결 중이면 중복 연결 방지
    if (
      this.client?.active &&
      this.roomCode === roomCode &&
      this.participantId === participantId
    ) {
      return;
    }

    await this.disconnect();

    this.roomCode = roomCode;
    this.participantId = participantId;

    this.setStatus(SOCKET_STATUS.CONNECTING);

    const client = new Client({
      brokerURL: BROKER_URL,

      reconnectDelay: 3000,

      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      // 개발할 때만 STOMP 로그 확인
      debug: import.meta.env.DEV
        ? (message) => console.log("[STOMP]", message)
        : undefined,
    });

    // 최초 연결과 재연결 직전에 참가자 식별 헤더 설정
    // 서버는 STOMP CONNECT Header의 Participant-Id로 참가자를 식별한다 (4.1)
    client.beforeConnect = () => {
      client.connectHeaders = {
        "Participant-Id": this.participantId,
      };
    };

    // 최초 연결 및 재연결 성공 시 실행
    client.onConnect = () => {
      this.setStatus(SOCKET_STATUS.CONNECTED);

      this.subscribeRoom();
      this.subscribeErrors();

      // 재접속 후 REST API를 다시 조회할 수 있도록 알림
      this.connectedListeners.forEach((listener) => {
        listener();
      });
    };

    client.onWebSocketClose = () => {
      this.roomSubscription = null;
      this.errorSubscription = null;

      if (client.active) {
        this.setStatus(SOCKET_STATUS.RECONNECTING);
      } else {
        this.setStatus(SOCKET_STATUS.DISCONNECTED);
      }
    };

    client.onWebSocketError = (error) => {
      console.error("[WebSocket error]", error);
      this.setStatus(SOCKET_STATUS.ERROR);
    };

    client.onStompError = (frame) => {
      console.error("[STOMP error]", {
        headers: frame.headers,
        body: frame.body,
      });

      this.setStatus(SOCKET_STATUS.ERROR);
    };

    this.client = client;
    client.activate();
  }

  /**
   * 구독 해제 후 STOMP 연결을 끊는다. 방을 나가거나(leaveRoom) 페이지를 벗어날 때 호출한다.
   * useRoomSocket을 쓰면 컴포넌트 언마운트 시 자동으로 호출되므로 직접 부를 일은
   * "자발적 나가기"처럼 연결을 끊고 즉시 다른 화면으로 이동하는 경우 정도다.
   * @example
   * await RoomAPI.leaveRoom(roomCode, participantId);
   * await socketClient.disconnect();
   */
  async disconnect() {
    this.roomSubscription?.unsubscribe();
    this.roomSubscription = null;

    this.errorSubscription?.unsubscribe();
    this.errorSubscription = null;

    const client = this.client;

    this.client = null;
    this.roomCode = null;
    this.participantId = null;

    if (client?.active) {
      await client.deactivate();
    }

    this.setStatus(SOCKET_STATUS.DISCONNECTED);
  }

  // 방 전체 브로드캐스트 이벤트 구독 (3.2 공통 구독 주소)
  subscribeRoom() {
    if (!this.client?.connected || !this.roomCode) {
      return;
    }

    this.roomSubscription = this.client.subscribe(
      `/topic/rooms/${this.roomCode}`,
      (message) => {
        this.handleMessage(message.body, this.eventListeners);
      },
    );
  }

  // 요청자 개인에게만 전달되는 에러 구독 (3.3 개인 오류 구독 주소)
  subscribeErrors() {
    if (!this.client?.connected) {
      return;
    }

    this.errorSubscription = this.client.subscribe(
      "/user/queue/errors",
      (message) => {
        this.handleMessage(message.body, this.errorListeners);
      },
    );
  }

  /**
   * 임의의 STOMP 목적지로 발행한다. 실제 방 액션(enter/kick/start/answer/next)은
   * 이미 RoomSocket.js에 래핑돼 있으니 그쪽을 쓰고, 이 함수는 그 내부 구현이나
   * RoomSocket에 없는 새 발행 주소를 임시로 쓸 때만 직접 호출한다.
   * @param {String} destination
   * @param {Object} [body]
   * @example
   * socketClient.publish(`/app/rooms/${roomCode}/start`);
   * socketClient.publish(`/app/rooms/${roomCode}/answer`, { roundId, textAnswer: "맛집 탐방" });
   */
  publish(destination, body = {}) {
    if (!this.client?.connected) {
      console.warn("[SocketClient] 연결되지 않은 상태에서 publish를 시도했습니다.", {
        destination,
      });
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  // 공통 응답 형식 { type, data } 파싱 후 리스너에 전달
  handleMessage(body, listeners) {
    try {
      const event = JSON.parse(body);

      if (!event?.type) {
        throw new Error("이벤트에 type이 없습니다.");
      }

      listeners.forEach((listener) => {
        listener(event);
      });
    } catch (error) {
      console.error("[Invalid socket event]", {
        body,
        error,
      });
    }
  }

  /**
   * 방 topic( /topic/rooms/{roomCode} )으로 오는 모든 이벤트를 받는다.
   * useRoomSocket이 이미 이 리스너를 등록해 participants/round/roundResult/voteUpdate/gameEnded로
   * 나눠 상태에 반영해주므로, 컴포넌트에서 새로 붙일 일은 드물다 — 훅이 다루지 않는 이벤트를
   * 별도로 관찰하고 싶을 때만 직접 등록한다. 반환값은 구독 해제 함수이므로 언마운트 시 꼭 호출한다.
   * @param {(event: {type: String, data: any}) => void} listener
   * @returns {() => void} unsubscribe
   * @example
   * useEffect(() => socketClient.onEvent((event) => console.log(event.type, event.data)), []);
   */
  onEvent(listener) {
    this.eventListeners.add(listener);

    return () => {
      this.eventListeners.delete(listener);
    };
  }

  /**
   * 개인 오류 큐( /user/queue/errors )로 오는 ERROR 이벤트만 받는다.
   * useRoomSocket의 error 상태가 이미 이 리스너로 채워지므로, 토스트/얼럿을 훅 밖에서
   * 별도로 띄우고 싶을 때만 직접 등록한다.
   * @param {(event: {type: "ERROR", data: any}) => void} listener
   * @returns {() => void} unsubscribe
   * @example
   * useEffect(() => socketClient.onError((event) => toast.error(event.data.message)), []);
   */
  onError(listener) {
    this.errorListeners.add(listener);

    return () => {
      this.errorListeners.delete(listener);
    };
  }

  /**
   * 연결 상태(SOCKET_STATUS)가 바뀔 때마다 호출된다. 접속 중 표시줄, 재연결 안내 배너 등에 쓴다.
   * @param {(status: String) => void} listener
   * @returns {() => void} unsubscribe
   * @example
   * useEffect(() => socketClient.onStatusChange(setSocketStatus), []);
   */
  onStatusChange(listener) {
    this.statusListeners.add(listener);

    return () => {
      this.statusListeners.delete(listener);
    };
  }

  /**
   * 최초 연결 및 재연결이 성공할 때마다 호출된다 (subscribeRoom/subscribeErrors 완료 이후).
   * useRoomSocket은 이 시점에 RoomSocket.enterRoom을 자동 발행하고, 재연결 후 놓친 상태를
   * 복구하려면 이 콜백에서 RoomAPI.syncStatus를 호출하면 된다.
   * @param {() => void} listener
   * @returns {() => void} unsubscribe
   * @example
   * useEffect(() => socketClient.onConnected(() => {
   *   RoomAPI.syncStatus(roomCode, participantId).then(applyState);
   * }), []);
   */
  onConnected(listener) {
    this.connectedListeners.add(listener);

    return () => {
      this.connectedListeners.delete(listener);
    };
  }

  setStatus(status) {
    this.statusListeners.forEach((listener) => {
      listener(status);
    });
  }

  get connected() {
    return this.client?.connected ?? false;
  }
}

export const socketClient = new SocketClient();
