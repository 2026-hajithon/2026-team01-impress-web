import { socketClient } from "./socketClient";

// STOMP PUB 발행 전용 래퍼. 모든 함수는 socketClient가 연결된 상태여야 동작한다.
// 응답은 REST처럼 반환되지 않고 /topic/rooms/{roomCode} 또는 /user/queue/errors로 비동기 도착하므로
// useRoomSocket 훅의 onEvent/onError 리스너에서 결과를 받는다.
// 컴포넌트에서는 이 함수들을 직접 쓰기보다 useRoomSocket이 반환하는 actions를 통해 호출하는 것을 권장한다
// (roomCode 바인딩과 연결 상태 관리를 훅이 대신 해준다).
export const RoomSocket = {
  /**
   * 4.1 방 입장 완료
   * REST 방 생성/참여 후 WebSocket 연결 및 topic 구독을 마친 다음 1회 호출한다.
   * Payload 없음. 서버는 CONNECT 헤더의 Participant-Id로 참가자를 식별한다.
   * -> PARTICIPANT_LIST_UPDATE 방송으로 결과를 받는다.
   *
   * useRoomSocket을 쓰면 onConnected 시점에 자동으로 호출되므로 직접 부를 일은 거의 없다.
   * @param {String} roomCode
   * @example
   * // useRoomSocket 내부 구현 (참고용, 직접 호출할 필요는 없음)
   * socketClient.onConnected(() => RoomSocket.enterRoom(roomCode));
   */
  enterRoom: (roomCode) => {
    socketClient.publish(`/app/rooms/${roomCode}/enter`);
  },

  /**
   * 4.3 강제 퇴장 (방장 전용)
   * -> 대상자에게는 PARTICIPANT_KICKED, 방 전체에는 PARTICIPANT_LIST_UPDATE가 방송된다.
   * 프론트는 참가자 목록에서 role !== "HOST"일 때만 강퇴 버튼을 노출하고,
   * 자신이 대상(useRoomSocket의 kicked)이면 홈으로 이동시킨다.
   * @param {String} roomCode
   * @param {Number} targetParticipantId
   * @example
   * // 대기방 참가자 목록에서 방장이 강퇴 버튼을 눌렀을 때
   * <button onClick={() => actions.kick(participant.participantId)}>강퇴</button>
   */
  kickParticipant: (roomCode, targetParticipantId) => {
    socketClient.publish(`/app/rooms/${roomCode}/kick`, {
      targetParticipantId,
    });
  },

  /**
   * 4.4 게임 시작 (방장 전용)
   * Payload 없음. 방 상태가 WAITING 또는 FINISHED일 때만 서버가 수락한다.
   * -> 첫 ROUND_START가 방송되며, useRoomSocket의 round가 채워지는 시점에 라운드 화면으로 이동한다.
   * @param {String} roomCode
   * @example
   * // 대기방에서 방장만 보이는 시작 버튼
   * {myRole === "HOST" && <button onClick={actions.start}>게임 시작</button>}
   */
  startGame: (roomCode) => {
    socketClient.publish(`/app/rooms/${roomCode}/start`);
  },

  /**
   * 5.2 답변 제출
   * 모든 질문 유형이 같은 주소를 쓰되, qType에 맞는 필드 하나만 채워 보낸다. roundId는 항상 필수.
   * - BLANK: textAnswer
   * - INDIVIDUAL_CHOICE: selectedOptionId (대상자 포함 전원이 같은 선택지 목록에서 제출, 대상자의 선택이 정답이 된다)
   * - COMMON_VOTE: pickedParticipantId
   * 제출 후에는 서버가 ROUND_RESULT를 방송할 때까지 기다리고, 중복 제출 방지를 위해
   * 버튼을 비활성화하는 정도만 프론트에서 처리한다 (서버가 중복 요청을 한 건만 인정).
   * @param {String} roomCode
   * @param {{roundId: Number, textAnswer?: String, selectedOptionId?: Number, pickedParticipantId?: Number}} answer
   * @example
   * // qType별 호출 예시 (round는 ROUND_START로 받은 현재 라운드 정보)
   * actions.submitAnswer({ roundId: round.roundId, textAnswer: "맛집 탐방" });        // BLANK
   * actions.submitAnswer({ roundId: round.roundId, selectedOptionId: 13 });            // INDIVIDUAL_CHOICE
   * actions.submitAnswer({ roundId: round.roundId, pickedParticipantId: 2 });          // COMMON_VOTE
   */
  submitAnswer: (roomCode, { roundId, textAnswer, selectedOptionId, pickedParticipantId }) => {
    const payload = { roundId };

    if (textAnswer !== undefined) payload.textAnswer = textAnswer;
    if (selectedOptionId !== undefined) payload.selectedOptionId = selectedOptionId;
    if (pickedParticipantId !== undefined) payload.pickedParticipantId = pickedParticipantId;

    socketClient.publish(`/app/rooms/${roomCode}/answer`, payload);
  },

  /**
   * 5.4 다음 라운드 진행 동의
   * 결과 화면 "다음으로" 클릭 시 호출한다. roundId는 지금 보고 있는 결과 화면의 라운드여야 한다.
   * 과반수 도달 전까지는 화면을 이동하지 않고 NEXT_ROUND_VOTE_UPDATE로 현황만 갱신하며,
   * 과반수 도달 시 서버가 ROUND_START(다음 라운드) 또는 GAME_END(마지막 라운드)를 방송한다.
   * @param {String} roomCode
   * @param {Number} roundId
   * @example
   * const [voting, setVoting] = useState(false);
   * <button disabled={voting} onClick={() => { setVoting(true); actions.voteNext(roundResult.roundId); }}>
   *   {voting ? `${voteUpdate?.votedCount ?? 0}/${voteUpdate?.requiredCount ?? "?"} 대기 중` : "다음으로"}
   * </button>
   * // 화면 이동은 voting이 아니라 이후 도착하는 round 또는 gameEnded를 보고 처리한다
   */
  voteNextRound: (roomCode, roundId) => {
    socketClient.publish(`/app/rooms/${roomCode}/next`, { roundId });
  },
};
