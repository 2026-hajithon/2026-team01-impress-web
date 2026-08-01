import axiosClient from "./axiosClient";

export const RoomAPI = {
  /**
   * 방 생성. 홈 화면에서 방장이 방을 만들 때 1회 호출한다.
   * 응답으로 받은 participantId/roomCode는 sessionStorage 등에 저장해두고
   * 이후 REST 헤더와 useRoomSocket({ roomCode, participantId })에 그대로 재사용한다.
   * @param {String} hostName
   * @param {String} roomName
   * @returns {{roomCode: String, participantId: Number, role: String}}
   * @example
   * const { roomCode, participantId, role } = await RoomAPI.createRoom("김철수", "우리 방");
   * sessionStorage.setItem("roomCode", roomCode);
   * sessionStorage.setItem("participantId", participantId);
   * navigate(`/rooms/${roomCode}/waiting`); // 이후 useRoomSocket이 WS 연결·구독·enter 발행을 대신 처리
   */
  createRoom: async (hostName, roomName) => {
    const response = await axiosClient.post("/api/rooms", {
      hostName: hostName,
      roomName: roomName,
    });
    return response.data.data;
  },

  /**
   * 방 참여. 초대 링크/QR 등으로 들어온 참가자가 대기방 입장 전 1회 호출한다.
   * createRoom과 마찬가지로 participantId를 저장해두고 이후 계속 재사용한다.
   * @param {String} roomCode
   * @param {String} name
   * @returns {{participantId: Number, roomStatus: String, role: String}}
   * @example
   * const { participantId, role } = await RoomAPI.joinRoom(roomCode, "이영희");
   * sessionStorage.setItem("participantId", participantId);
   * navigate(`/rooms/${roomCode}/waiting`);
   */
  joinRoom: async (roomCode, name) => {
    const response = await axiosClient.post(`/api/rooms/${roomCode}/join`, {
      name: name,
    });
    return response.data.data;
  },

  /**
   * 현재 상태 동기화. 새로고침 직후, 또는 useRoomSocket의 onConnected(재연결) 시점에 호출해
   * WebSocket 이벤트로 놓쳤을 수 있는 화면 상태를 복구한다. roomStatus/phase를 보고 어느 화면인지 분기한다.
   * 1. 대기방 상태 (roomStatus: WAITING)
   * 2. 게임 진행 상태 (roomStatus: PLAYING, currentRound.phase: ANSWERING)
   * 3. 라운드 결과 화면 상태 (roomStatus: PLAYING, currentRound.phase: RESULT)
   * 4. 게임 종료 상태 (roomStatus: FINISHED)
   * @param {String} roomCode
   * @param {Number} participantId
   * @returns {{roomStatus: String, myRole: String, participants: {participantId: String, name: String, role: String, connectionStatus: String}[]} |
   * {roomStatus: String, myRole: String, currentRound: {roundId: Number, roundOrder: Number, totalRounds: Number, qType: String, phase: String, timeRemaining: Number, myAnswerSubmitted: boolean, mySelectedOptionId: Number|null, question: String, targetId: Number, options?: {optionId: Number, content: String, displayOrder: Number}[]}} |
   * {roomStatus: String, myRole: String, currentRound: {roundId: Number, roundOrder: Number, totalRounds: Number, qType: String, phase: String, myNextVoteSubmitted: boolean, nextVoteCount: Number, nextVoteRequired: Number, question: String, targetId: Number, mySelectedOptionId: Number, result: {targetAnswerOptionId: Number, mostSelectedOptionIds: Number[], optionResults: {optionId: Number, content: String, displayOrder: Number, count: Number}[]}}} |
   * {roomStatus: String, myRole: String}}
   * @example
   * const state = await RoomAPI.syncStatus(roomCode, participantId);
   * if (state.roomStatus === "FINISHED") {
   *   const result = await RoomAPI.getResult(roomCode, participantId);
   *   navigate(`/rooms/${roomCode}/result`, { state: result });
   * } else if (state.roomStatus === "PLAYING") {
   *   navigate(`/rooms/${roomCode}/round`, { state: state.currentRound });
   * } else {
   *   navigate(`/rooms/${roomCode}/waiting`, { state: state.participants });
   * }
   */
  syncStatus: async (roomCode, participantId) => {
    const response = await axiosClient.get(`/api/rooms/${roomCode}/sync`, {
      headers: {
        "Participant-Id": participantId,
      },
    });
    return response.data.data;
  },

  /**
   * 자발적 방 나가기. 대기방 화면의 "나가기" 버튼에서만 호출한다 — 게임 시작(PLAYING) 후에는
   * 서버가 거절하므로, useRoomSocket의 status/roomStatus를 보고 WAITING일 때만 버튼을 노출한다.
   * 성공하면 WebSocket 연결도 함께 끊어야 하므로 socketClient.disconnect()를 뒤이어 호출한다.
   * 다른 엔드포인트와 달리 {success, message, data} wrapper 없이 {success: boolean}을 바로 반환한다 (API 명세 2.4).
   * @param {String} roomCode
   * @param {Number} participantId
   * @returns {{success: boolean}}
   * @example
   * await RoomAPI.leaveRoom(roomCode, participantId);
   * socketClient.disconnect();
   * navigate("/");
   */
  leaveRoom: async (roomCode, participantId) => {
    const response = await axiosClient.delete(
      `/api/rooms/${roomCode}/participants/me`,
      {
        headers: { "Participant-Id": participantId },
      },
    );
    return response.data;
  },

  /**
   * 최종 게임 결과 조회 (가장 최근에 종료된 게임 한 판만 반환).
   * useRoomSocket의 gameEnded가 true가 되거나 syncStatus에서 roomStatus === "FINISHED"를
   * 받았을 때, 결과 화면에 진입하며 호출한다.
   * @param {String} roomCode
   * @param {Number} participantId
   * @returns {{roomCode: String, roomName: String, gameSessionId: Number,
   * participants: {participantId: Number, name: String, role: String}[],
   * rounds: {roundId: Number, roundOrder: Number, qType: String, targetId: Number, targetName: String, question: String,
   *  result: {answers: {submitterId: Number, submitterName: String, textAnswer: String}[]} |
   *  {targetAnswerOptionId: Number, mostSelectedOptionIds: Number[], optionResults: {optionId: Number, content: String, displayOrder: Number, count: Number}[]} |
   *  {votes: {participantId: Number, participantName: String, count: Number, rank?: Number}[]}}[]}}
   * @example
   * useEffect(() => {
   *   if (!gameEnded) return;
   *   RoomAPI.getResult(roomCode, participantId).then(setFinalResult);
   * }, [gameEnded]);
   */
  getResult: async (roomCode, participantId) => {
    const response = await axiosClient.get(`/api/rooms/${roomCode}/result`, {
      headers: { "Participant-Id": participantId },
    });
    return response.data.data;
  },

  // 1차 구현에서는 제외.
  // ROUND_START 웹소켓 이벤트에서 전달되므로 전체 질문을 미리 조회할 필요가 없음

  // /**
  //  * 질문 구성 정보 조회
  //  * @param {String} roomCode
  //  * @returns
  //  */
  // getQuestions: async (roomCode) => {
  //   const response = await axiosClient.get(`/api/rooms/${roomCode}/questions`);
  //   return response.data;
  // },
};
