import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoomSocket } from "@hooks/useRoomSocket";
import PersonalAnswerGamePage from "./PersonalAnswerGamePage";
import PersonalChoiceGamePage from "./PersonalChoiceGamePage";
import GeneralChoiceGamePage from "./GeneralChoiceGamePage";
import AnswerResultPage from "./AnswerResultPage";
import ChoiceResultPage from "./ChoiceResultPage";
import VoteResultPage from "./VoteResultPage";

const Q_TYPE = {
  BLANK: "BLANK",
  INDIVIDUAL_OX: "INDIVIDUAL_OX",
  COMMON_VOTE: "COMMON_VOTE",
};

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

  const { participants, round, roundResult, voteUpdate, gameEnded, kicked, mockMode, actions } =
    useRoomSocket({ roomCode, participantId });

  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);

  // 새 라운드로 바뀌면 타이머/제출 상태를 그 라운드 값으로 리셋한다 (렌더 중 상태 조정).
  const [syncedRoundId, setSyncedRoundId] = useState(null);
  if (round && round.roundId !== syncedRoundId) {
    setSyncedRoundId(round.roundId);
    setTimeLeft(round.timeRemaining ?? 0);
    setSubmitted(Boolean(round.myAnswerSubmitted));
    setLastAnswer(null);
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

  useEffect(() => {
    if (gameEnded) navigate(`/rooms/${roomCode}/result`);
  }, [gameEnded, roomCode, navigate]);

  if (!round) return null;

  const target = participants.find((p) => p.participantId === round.targetId);

  const handleSubmit = (answer) => {
    setSubmitted(true);
    setLastAnswer(Object.values(answer)[0]);
    actions.submitAnswer({ roundId: round.roundId, ...answer });
  };

  const handleNext = () => actions.voteNext(round.roundId);

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
      />
    );
  } else if (isShowingResult && round.qType === Q_TYPE.INDIVIDUAL_OX) {
    content = (
      <ChoiceResultPage
        roomName={roomName}
        targetName={target?.name}
        question={round.question}
        options={round.options ?? ["O", "X"]}
        counts={roundResult.result?.optionCounts ?? {}}
        trueAnswer={roundResult.result?.trueAnswer}
        myAnswer={lastAnswer}
        voteUpdate={voteUpdate}
        onNext={handleNext}
      />
    );
  } else if (isShowingResult) {
    const ranking = (
      roundResult.result?.ranking ??
      participants.map((p) => ({ participantId: p.participantId, name: p.name, votes: 0 }))
    )
      .slice()
      .sort((a, b) => b.votes - a.votes);

    content = (
      <VoteResultPage
        roomName={roomName}
        question={round.question}
        ranking={ranking}
        voteUpdate={voteUpdate}
        onNext={handleNext}
      />
    );
  } else {
    const commonProps = { roomName, timeLeft, submitted };

    if (round.qType === Q_TYPE.BLANK) {
      content = (
        <PersonalAnswerGamePage
          {...commonProps}
          targetName={target?.name}
          question={round.question}
          onSubmit={(textAnswer) => handleSubmit({ textAnswer })}
        />
      );
    } else if (round.qType === Q_TYPE.INDIVIDUAL_OX) {
      content = (
        <PersonalChoiceGamePage
          {...commonProps}
          targetName={target?.name}
          question={round.question}
          options={round.options ?? ["O", "X"]}
          onSubmit={(choiceAnswer) => handleSubmit({ choiceAnswer })}
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

  return (
    <>
      {mockMode && <MockModeBadge />}
      {content}
    </>
  );
};

export default GameRoundPage;
