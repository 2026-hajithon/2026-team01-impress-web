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

// 라운드 데이터를 소켓에서 받아 qType에 맞는 게임 화면(답변 중 / 결과)으로 분기한다.
const GameRoundPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const participantId = Number(sessionStorage.getItem("participantId"));
  const roomName = sessionStorage.getItem("roomName") ?? "";

  const { participants, round, roundResult, voteUpdate, gameEnded, kicked, actions } =
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

  if (isShowingResult) {
    if (round.qType === Q_TYPE.BLANK) {
      return (
        <AnswerResultPage
          roomName={roomName}
          targetName={target?.name}
          question={round.question}
          answers={roundResult.result?.answers ?? []}
          voteUpdate={voteUpdate}
          onNext={handleNext}
        />
      );
    }

    if (round.qType === Q_TYPE.INDIVIDUAL_OX) {
      return (
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
    }

    const ranking = (
      roundResult.result?.ranking ??
      participants.map((p) => ({ participantId: p.participantId, name: p.name, votes: 0 }))
    )
      .slice()
      .sort((a, b) => b.votes - a.votes);

    return (
      <VoteResultPage
        roomName={roomName}
        question={round.question}
        ranking={ranking}
        voteUpdate={voteUpdate}
        onNext={handleNext}
      />
    );
  }

  const commonProps = { roomName, timeLeft, submitted };

  if (round.qType === Q_TYPE.BLANK) {
    return (
      <PersonalAnswerGamePage
        {...commonProps}
        targetName={target?.name}
        question={round.question}
        onSubmit={(textAnswer) => handleSubmit({ textAnswer })}
      />
    );
  }

  if (round.qType === Q_TYPE.INDIVIDUAL_OX) {
    return (
      <PersonalChoiceGamePage
        {...commonProps}
        targetName={target?.name}
        question={round.question}
        options={round.options ?? ["O", "X"]}
        onSubmit={(choiceAnswer) => handleSubmit({ choiceAnswer })}
      />
    );
  }

  return (
    <GeneralChoiceGamePage
      {...commonProps}
      question={round.question}
      participants={participants}
      onSubmit={(pickedParticipantId) => handleSubmit({ pickedParticipantId })}
    />
  );
};

export default GameRoundPage;
