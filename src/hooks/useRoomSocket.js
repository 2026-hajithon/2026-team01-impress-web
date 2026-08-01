import { useCallback, useEffect, useMemo, useState } from "react";
import { socketClient } from "../apis/socketClient";
import { RoomSocket } from "../apis/RoomSocket";
import { ROOM_EVENT, SOCKET_STATUS } from "../utils/eventTypes";

/**
 * 대기방 + 게임 진행 WebSocket을 통째로 다루는 훅.
 * 컴포넌트는 이 훅 하나만 붙이면 연결/구독/입장 발행/이벤트 반영/해제까지 전부 자동으로 처리된다.
 * roomCode/participantId는 RoomAPI.createRoom·joinRoom 응답을 저장해둔 값을 그대로 넘기면 된다.
 *
 * @param {{roomCode: String, participantId: Number}} params
 * @returns {{
 *   status: String,                 // SOCKET_STATUS: CONNECTING/CONNECTED/RECONNECTING/DISCONNECTED/ERROR
 *   connected: boolean,             // status === "connected" 축약값
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
 *     submitAnswer: (answer: {roundId: Number, textAnswer?: String, choiceAnswer?: String, pickedParticipantId?: Number}) => void,
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
export function useRoomSocket({ roomCode, participantId }) {
  const [status, setStatus] = useState(SOCKET_STATUS.DISCONNECTED);
  const [participants, setParticipants] = useState([]);
  const [round, setRound] = useState(null); // ROUND_START data
  const [roundResult, setRoundResult] = useState(null); // ROUND_RESULT data
  const [voteUpdate, setVoteUpdate] = useState(null); // NEXT_ROUND_VOTE_UPDATE data
  const [gameEnded, setGameEnded] = useState(false);
  const [kicked, setKicked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomCode || !participantId) {
      return undefined;
    }

    socketClient.connect({ roomCode, participantId });

    const unsubStatus = socketClient.onStatusChange(setStatus);

    // WS 연결(및 재연결) 성공 직후 4.1 입장 발행 -> PARTICIPANT_LIST_UPDATE로 참가자 목록을 받는다
    const unsubConnected = socketClient.onConnected(() => {
      RoomSocket.enterRoom(roomCode);
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
          // qType(BLANK/INDIVIDUAL_OX/COMMON_VOTE)에 따라 data.result 모양이 다르다 (5.3)
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
      unsubStatus();
      unsubConnected();
      unsubEvent();
      unsubError();
      socketClient.disconnect();
    };
  }, [roomCode, participantId]);

  // 4.3 강제 퇴장 — 방장만 노출: {myRole === "HOST" && <button onClick={() => actions.kick(id)} />}
  const kick = useCallback(
    (targetParticipantId) => RoomSocket.kickParticipant(roomCode, targetParticipantId),
    [roomCode],
  );

  // 4.4 게임 시작 — 방장만 노출, roomStatus가 WAITING/FINISHED일 때만 서버가 수락
  const start = useCallback(() => RoomSocket.startGame(roomCode), [roomCode]);

  // 5.2 답변 제출 — qType에 맞는 필드 하나만 채워서 호출 (textAnswer | choiceAnswer | pickedParticipantId)
  const submitAnswer = useCallback(
    (answer) => RoomSocket.submitAnswer(roomCode, answer),
    [roomCode],
  );

  // 5.4 다음 라운드 동의 — 결과 화면 "다음으로" 클릭 시, roundResult.roundId를 넘긴다
  const voteNext = useCallback(
    (roundId) => RoomSocket.voteNextRound(roomCode, roundId),
    [roomCode],
  );

  const actions = useMemo(
    () => ({ kick, start, submitAnswer, voteNext }),
    [kick, start, submitAnswer, voteNext],
  );

  return {
    status,
    connected: status === SOCKET_STATUS.CONNECTED,
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
