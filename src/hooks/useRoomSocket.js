import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { socketClient } from "../apis/socketClient";
import { RoomSocket } from "../apis/RoomSocket";
import { ROOM_EVENT, SOCKET_STATUS } from "../utils/eventTypes";
import {
  MOCK_PARTICIPANTS,
  createMockGameRounds,
  createMockRoundResult,
} from "../apis/mockData";
import { RoomAPI } from "../apis/RoomAPI";

// 개발 환경에서 이 시간(ms) 안에 웹소켓이 연결되지 않으면, 백엔드가 없다고 보고 목 데이터로 전환한다.
const MOCK_FALLBACK_DELAY_MS = 4000;
// 목 모드에서 제출/다음 라운드 진행이 실제 서버처럼 느껴지도록 흉내내는 지연 시간.
const MOCK_ACTION_DELAY_MS = 500;

/**
 * 대기방 + 게임 진행 WebSocket을 통째로 다루는 훅.
 * 컴포넌트는 이 훅 하나만 붙이면 연결/구독/입장 발행/이벤트 반영/해제까지 전부 자동으로 처리된다.
 * roomCode/participantId는 RoomAPI.createRoom·joinRoom 응답을 저장해둔 값을 그대로 넘기면 된다.
 *
 * @param {{roomCode: String, participantId: Number}} params
 * @returns {{
 *   status: String,                 // SOCKET_STATUS: CONNECTING/CONNECTED/RECONNECTING/DISCONNECTED/ERROR
 *   connected: boolean,             // status === "connected" 축약값
 *   mockMode: boolean,              // 개발 환경에서 웹소켓 연결 실패로 목 데이터를 대신 흘리는 중인지 여부
 *   participants: Array,            // PARTICIPANT_LIST_UPDATE 최신 목록 (4.2)
 *   round: Object|null,             // ROUND_START data, 새 라운드마다 갱신 (5.1)
 *   roundResult: Object|null,       // ROUND_RESULT data, qType별로 result 모양이 다름 (5.3)
 *   voteUpdate: Object|null,        // NEXT_ROUND_VOTE_UPDATE data (5.4)
 *   gameEnded: boolean,             // GAME_END 수신 여부 (6)
 *   kicked: boolean,                // 내가 강퇴당했는지 (4.3)
 *   error: Object|null,             // /user/queue/errors로 온 마지막 오류
 *   actions: {
 *     kick: (targetParticipantId: Number) => void,
 *     start: () => void,
 *     submitAnswer: (answer: {roundId: Number, textAnswer?: String, selectedOptionId?: Number, pickedParticipantId?: Number}) => void,
 *     voteNext: (roundId: Number) => void,
 *   },
 * }}
 * @example
 * function WaitingRoomPage() {
 *   const { roomCode, participantId } = useRoomInfo(); // sessionStorage 등에서 복원
 *   const { participants, round, gameEnded, kicked, actions } = useRoomSocket({ roomCode, participantId });
 *
 *   useEffect(() => { if (kicked) navigate("/"); }, [kicked]);
 *   useEffect(() => { if (round) navigate(`/rooms/${roomCode}/round`); }, [round]);
 *   useEffect(() => {
 *     if (!gameEnded) return;
 *     RoomAPI.getResult(roomCode, participantId).then((result) => navigate(`/rooms/${roomCode}/result`, { state: result }));
 *   }, [gameEnded]);
 *
 *   return (
 *     <>
 *       {participants.map((p) => (
 *         <ParticipantRow key={p.participantId} {...p} onKick={() => actions.kick(p.participantId)} />
 *       ))}
 *       <button onClick={actions.start}>게임 시작</button>
 *     </>
 *   );
 * }
 */
export function useRoomSocket({
  roomCode,
  participantId,
  forceMock = false,
  mockHostName = "",
  mockParticipants: suppliedMockParticipants,
}) {
  const [status, setStatus] = useState(SOCKET_STATUS.DISCONNECTED);
  const [participants, setParticipants] = useState([]);
  const [round, setRound] = useState(null); // ROUND_START data
  const [roundResult, setRoundResult] = useState(null); // ROUND_RESULT data
  const [voteUpdate, setVoteUpdate] = useState(null); // NEXT_ROUND_VOTE_UPDATE data
  const [gameEnded, setGameEnded] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [error, setError] = useState(null);
  const [mockMode, setMockMode] = useState(false);

  // setTimeout 콜백 안에서 최신 status를 읽기 위한 ref (effect 클로저는 마운트 시점 값을 들고 있으므로).
  const statusRef = useRef(status);
  const mockIndexRef = useRef(0);
  const mockRoundsRef = useRef([]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!roomCode || !participantId) {
      return undefined;
    }

    const mockParticipants = (
      suppliedMockParticipants?.length ? suppliedMockParticipants : MOCK_PARTICIPANTS
    ).map((participant) =>
      participant.role === "HOST" && mockHostName
        ? { ...participant, name: mockHostName }
        : participant,
    );
    const startMockGame = () => {
      mockIndexRef.current = 0;
      mockRoundsRef.current = createMockGameRounds(mockParticipants);
      setMockMode(true);
      setParticipants(mockParticipants);
      setRound(mockRoundsRef.current[0]);
      setRoundResult(null);
      setVoteUpdate(null);
      setGameEnded(false);
    };

    if (forceMock) {
      startMockGame();
      return undefined;
    }

    socketClient.connect({ roomCode, participantId });

    const unsubStatus = socketClient.onStatusChange(setStatus);

    // 개발 환경 전용: 일정 시간 안에 연결되지 않으면 실제 서버 없이도 화면을 확인할 수 있도록 목 데이터로 전환한다.
    let mockFallbackTimer;
    if (import.meta.env.DEV) {
      mockFallbackTimer = setTimeout(() => {
        if (statusRef.current === SOCKET_STATUS.CONNECTED) return;

        console.warn(
          "%c[Mock] 웹소켓 서버에 연결하지 못해 목 데이터로 전환합니다.",
          "color:#101012; background:#ffbadc; padding:2px 6px; border-radius:4px; font-weight:bold",
          { roomCode, participantId },
        );

        socketClient.disconnect();
        startMockGame();
      }, MOCK_FALLBACK_DELAY_MS);
    }

    // WS 연결(및 재연결) 성공 직후 4.1 입장 발행 -> PARTICIPANT_LIST_UPDATE로 참가자 목록을 받는다.
    // 그 직후 REST로 현재 상태를 동기화해서, 최초 진입/새로고침/재접속 시 놓친 화면 상태를 복구한다.
    const unsubConnected = socketClient.onConnected(() => {
      RoomSocket.enterRoom(roomCode);

      RoomAPI.syncStatus(roomCode, participantId)
        .then((state) => {
          if (state.participants) {
            setParticipants(state.participants);
          }

          if (state.roomStatus === "FINISHED") {
            setGameEnded(true);
            return;
          }

          if (!state.currentRound) return;

          if (state.currentRound.phase === "RESULT") {
            setRound(state.currentRound);
            setRoundResult(state.currentRound);
            setVoteUpdate({
              votedCount: state.currentRound.nextVoteCount,
              requiredCount: state.currentRound.nextVoteRequired,
            });
          } else {
            setRound(state.currentRound);
            setRoundResult(null);
            setVoteUpdate(null);
          }
        })
        .catch((syncError) => {
          console.error("[REST] 상태 동기화(syncStatus) 실패", syncError);
        });
    });

    const unsubEvent = socketClient.onEvent((event) => {
      switch (event.type) {
        case ROOM_EVENT.PARTICIPANT_LIST_UPDATE:
          // 입장/퇴장/강퇴/재접속 등 발생 시마다 전체 목록이 통째로 내려온다 (4.2)
          setParticipants(event.data);
          break;

        case ROOM_EVENT.PARTICIPANT_KICKED:
          // 내가 강퇴 대상이면 화면 이동은 이 값을 보고 컴포넌트가 처리한다 (4.3)
          if (event.data.targetParticipantId === participantId) {
            setKicked(true);
          }
          break;

        case ROOM_EVENT.ROUND_START:
          // 새 라운드 시작 -> 직전 라운드의 결과/투표 현황 정리 (5.1)
          setRound(event.data);
          setRoundResult(null);
          setVoteUpdate(null);
          break;

        case ROOM_EVENT.ROUND_RESULT:
          // qType(BLANK/INDIVIDUAL_CHOICE/COMMON_VOTE)에 따라 data.result 모양이 다르다 (5.3)
          setRoundResult(event.data);
          break;

        case ROOM_EVENT.NEXT_ROUND_VOTE_UPDATE:
          // "다음으로" 과반수 집계 현황. 화면 이동은 이후 ROUND_START/GAME_END로만 한다 (5.4)
          setVoteUpdate(event.data);
          break;

        case ROOM_EVENT.GAME_END:
          // data는 null. 최종 결과는 REST GET /api/rooms/{roomCode}/result로 별도 조회한다 (6)
          setGameEnded(true);
          break;

        default:
          break;
      }
    });

    const unsubError = socketClient.onError((event) => {
      setError(event.data);
    });

    return () => {
      clearTimeout(mockFallbackTimer);
      unsubStatus();
      unsubConnected();
      unsubEvent();
      unsubError();
      socketClient.disconnect();
    };
  }, [forceMock, mockHostName, participantId, roomCode, suppliedMockParticipants]);

  // 4.3 강제 퇴장 — 방장만 노출: {myRole === "HOST" && <button onClick={() => actions.kick(id)} />}
  const kick = useCallback(
    (targetParticipantId) => {
      if (mockMode) {
        console.log("%c[Mock] kick", "color:#8dacff", { targetParticipantId });
        return;
      }
      RoomSocket.kickParticipant(roomCode, targetParticipantId);
    },
    [roomCode, mockMode],
  );

  // 4.4 게임 시작 — 방장만 노출, roomStatus가 WAITING/FINISHED일 때만 서버가 수락
  const start = useCallback(() => {
    if (mockMode) {
      console.log("%c[Mock] start", "color:#8dacff");
      return;
    }
    RoomSocket.startGame(roomCode);
  }, [roomCode, mockMode]);

  // 5.2 답변 제출 — qType에 맞는 필드 하나만 채워서 호출 (textAnswer | selectedOptionId | pickedParticipantId)
  const submitAnswer = useCallback(
    (answer) => {
      if (mockMode) {
        console.log("%c[Mock] submitAnswer", "color:#8dacff", answer);
        const activeRound = mockRoundsRef.current[mockIndexRef.current];

        setTimeout(() => {
          setRoundResult(createMockRoundResult(activeRound, participants));
        }, MOCK_ACTION_DELAY_MS);
        return;
      }
      RoomSocket.submitAnswer(roomCode, answer);
    },
    [mockMode, participants, roomCode],
  );

  // 목 게임에서 제한 시간이 끝났을 때 서버의 ROUND_RESULT 이벤트를 대신 발생시킨다.
  const finishRound = useCallback(() => {
    if (!mockMode) return;

    const activeRound = mockRoundsRef.current[mockIndexRef.current];
    setRoundResult(createMockRoundResult(activeRound, participants));
  }, [mockMode, participants]);

  // 5.4 다음 라운드 동의 — 결과 화면 "다음으로" 클릭 시, roundResult.roundId를 넘긴다
  const voteNext = useCallback(
    (roundId) => {
      if (mockMode) {
        console.log("%c[Mock] voteNext", "color:#8dacff", { roundId });

        setTimeout(() => {
          mockIndexRef.current += 1;

          if (mockIndexRef.current >= mockRoundsRef.current.length) {
            setGameEnded(true);
            return;
          }

          setRoundResult(null);
          setVoteUpdate(null);
          setRound(mockRoundsRef.current[mockIndexRef.current]);
        }, MOCK_ACTION_DELAY_MS);
        return;
      }
      RoomSocket.voteNextRound(roomCode, roundId);
    },
    [roomCode, mockMode],
  );

  const actions = useMemo(
    () => ({ kick, start, submitAnswer, finishRound, voteNext }),
    [finishRound, kick, start, submitAnswer, voteNext],
  );

  return {
    status,
    connected: status === SOCKET_STATUS.CONNECTED,
    mockMode,
    participants,
    round,
    roundResult,
    voteUpdate,
    gameEnded,
    kicked,
    error,
    actions,
  };
}
