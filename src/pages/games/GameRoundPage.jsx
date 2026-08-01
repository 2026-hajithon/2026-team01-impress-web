import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoomSocket } from "@hooks/useRoomSocket";
import PersonalAnswerGamePage from "./PersonalAnswerGamePage";
import PersonalChoiceGamePage from "./PersonalChoiceGamePage";
import GeneralChoiceGamePage from "./GeneralChoiceGamePage";
import AnswerResultPage from "@pages/results/AnswerResultPage";
import ChoiceResultPage from "@pages/results/ChoiceResultPage";
import VoteResultPage from "@pages/results/VoteResultPage";
import LeaveGameModal from "./LeaveGameModal";
import OnboardingPage from "@pages/onboardings/OnboardingPage";

const Q_TYPE = {
  BLANK: "BLANK",
  INDIVIDUAL_CHOICE: "INDIVIDUAL_CHOICE",
  COMMON_VOTE: "COMMON_VOTE",
};

// ROUND_START 소켓 이벤트는 timeLimit, RoomAPI.syncStatus 응답은 timeRemaining으로 남은 시간을 준다.
// 값이 없어도(undefined) 타이머가 0에 멈춰 보이지 않도록 기본 라운드 시간(mock 데이터와 동일한 60초)으로 대체한다.
const DEFAULT_ROUND_DURATION = 60;
const ROUND_TRANSITION_DURATION = 3000;

// 개발 환경에서 목 데이터로 대체 중일 때 화면 우측 상단에 띄우는 표시.
const MockModeBadge = () => (
  <div className="pointer-events-none fixed right-3 top-14.5 z-50 rounded-full bg-main-pink px-2.5 py-1 text-caption1-1 text-white shadow-lg">
    MOCK
  </div>
);

// 라운드 데이터를 소켓에서 받아 qType에 맞는 게임 화면(답변 중 / 결과)으로 분기한다.
const GameRoundPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const participantId = Number(sessionStorage.getItem("participantId"));
  const roomName = sessionStorage.getItem("roomName") ?? "";
  const hostName = sessionStorage.getItem("hostName") ?? "";
  const forceMock = sessionStorage.getItem("gameMode") === "mock";
  const mockParticipants = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("mockParticipants") ?? "null");
    } catch {
      return null;
    }
  }, []);

  const { participants, round, roundResult, voteUpdate, gameEnded, kicked, mockMode, actions } =
    useRoomSocket({
      roomCode,
      participantId,
      forceMock,
      mockHostName: hostName,
      mockParticipants,
    });

  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimerRef = useRef(null);
  const previousRoundIdRef = useRef(null);

  // 대기방과 동일하게 참가자 목록에서 내 role을 찾아 방장 여부를 판단한다 (myRole 전용 필드는 따로 없음).
  const isHost = participants.find((p) => p.participantId === participantId)?.role === "HOST";
  // 방장만 라운드 중 "나가기"를 볼 수 있다. 실제 나가기 동작(REST 호출 등)은 모달 쪽에서 확정되면 연결한다.
  const onLeave = isHost ? () => setLeaveModalOpen(true) : undefined;

  // 새 라운드로 바뀌면 타이머/제출 상태를 그 라운드 값으로 리셋한다 (렌더 중 상태 조정).
  const [syncedRoundId, setSyncedRoundId] = useState(null);
  if (round && round.roundId !== syncedRoundId) {
    setSyncedRoundId(round.roundId);
    setTimeLeft(round.timeLimit ?? round.timeRemaining ?? DEFAULT_ROUND_DURATION);
    setSubmitted(Boolean(round.myAnswerSubmitted));
    // 새로고침/재접속으로 곧장 이 라운드를 받은 경우, /sync가 내려준 mySelectedOptionId로
    // "내가 고른 선택지" 표시를 복구한다 (직접 제출한 경우는 handleSubmit이 이미 채워둔다).
    setLastAnswer(round.mySelectedOptionId ?? null);
  }

  useEffect(() => {
    if (!round) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
    // round 객체 자체가 아니라 roundId가 바뀔 때만 타이머를 새로 시작한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round?.roundId]);

  useEffect(() => {
    if (kicked) navigate("/");
  }, [kicked, navigate]);

  // 과반수 도달 후 서버가 모두에게 ROUND_START를 방송했을 때만 다음 라운드 로딩을 시작한다.
  // useLayoutEffect로 새 문제 화면이 한 프레임 먼저 보이는 현상도 막는다.
  useLayoutEffect(() => {
    const currentRoundId = round?.roundId ?? null;
    const previousRoundId = previousRoundIdRef.current;
    previousRoundIdRef.current = currentRoundId;

    if (previousRoundId === null || currentRoundId === null || previousRoundId === currentRoundId) {
      return;
    }

    setTransitioning(true);
    window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(() => {
      setTransitioning(false);
    }, ROUND_TRANSITION_DURATION);
  }, [round?.roundId]);

  useEffect(() => {
    if (!gameEnded) return undefined;

    const resultTimer = window.setTimeout(() => {
      navigate(`/rooms/${roomCode}/result`);
    }, ROUND_TRANSITION_DURATION);

    return () => window.clearTimeout(resultTimer);
  }, [gameEnded, roomCode, navigate]);

  useEffect(
    () => () => {
      window.clearTimeout(transitionTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!round || roundResult || timeLeft !== 0) return;
    actions.finishRound();
  }, [actions, round, roundResult, timeLeft]);

  if (!round) return null;

  const target = participants.find((p) => p.participantId === round.targetId);
  const isQuestionTarget = Number(round.targetId) === participantId;
  const isBlankQuestionTarget = round.qType === Q_TYPE.BLANK && isQuestionTarget;

  const handleSubmit = (answer) => {
    if (isBlankQuestionTarget) return;
    setSubmitted(true);
    setLastAnswer(Object.values(answer)[0]);
    actions.submitAnswer({ roundId: round.roundId, ...answer });
  };

  const handleNext = () => {
    actions.voteNext(round.roundId);
  };

  const isShowingResult = roundResult?.roundId === round.roundId;

  let content;

  if (isShowingResult && round.qType === Q_TYPE.BLANK) {
    content = (
      <AnswerResultPage
        roomName={roomName}
        targetName={target?.name}
        question={round.question}
        answers={roundResult.result?.answers ?? []}
        voteUpdate={voteUpdate}
        onNext={handleNext}
        onLeave={onLeave}
      />
    );
  } else if (isShowingResult && round.qType === Q_TYPE.INDIVIDUAL_CHOICE) {
    content = (
      <ChoiceResultPage
        roomName={roomName}
        targetName={target?.name}
        question={round.question}
        optionResults={roundResult.result?.optionResults ?? []}
        targetAnswerOptionId={roundResult.result?.targetAnswerOptionId}
        mostSelectedOptionIds={roundResult.result?.mostSelectedOptionIds ?? []}
        mySelectedOptionId={lastAnswer}
        voteUpdate={voteUpdate}
        onNext={handleNext}
        onLeave={onLeave}
      />
    );
  } else if (isShowingResult) {
    const votes = (
      roundResult.result?.votes ??
      participants.map((p) => ({ participantId: p.participantId, participantName: p.name, count: 0 }))
    )
      .slice()
      .sort((a, b) => b.count - a.count);

    content = (
      <VoteResultPage
        roomName={roomName}
        question={round.question}
        votes={votes}
        voteUpdate={voteUpdate}
        onNext={handleNext}
        onLeave={onLeave}
      />
    );
  } else {
    const commonProps = { roomName, timeLeft, submitted, onLeave };

    if (round.qType === Q_TYPE.BLANK) {
      content = (
        <PersonalAnswerGamePage
          {...commonProps}
          targetName={target?.name}
          question={round.question}
          isQuestionTarget={isBlankQuestionTarget}
          onSubmit={(textAnswer) => handleSubmit({ textAnswer })}
        />
      );
    } else if (round.qType === Q_TYPE.INDIVIDUAL_CHOICE) {
      content = (
        <PersonalChoiceGamePage
          {...commonProps}
          targetName={target?.name}
          question={round.question}
          options={round.options ?? []}
          isQuestionTarget={isQuestionTarget}
          onSubmit={(selectedOptionId) => handleSubmit({ selectedOptionId })}
        />
      );
    } else {
      content = (
        <GeneralChoiceGamePage
          {...commonProps}
          question={round.question}
          participants={participants}
          onSubmit={(pickedParticipantId) => handleSubmit({ pickedParticipantId })}
        />
      );
    }
  }

  if (transitioning || gameEnded) return <OnboardingPage />;

  return (
    <>
      {mockMode && <MockModeBadge />}
      {content}
      <LeaveGameModal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={() => setLeaveModalOpen(false)}
      />
    </>
  );
};

export default GameRoundPage;
