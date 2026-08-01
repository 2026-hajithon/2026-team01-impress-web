import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalAnswerGamePage from "@pages/games/PersonalAnswerGamePage";
import PersonalChoiceGamePage from "@pages/games/PersonalChoiceGamePage";
import GeneralChoiceGamePage from "@pages/games/GeneralChoiceGamePage";
import AnswerResultPage from "@pages/results/AnswerResultPage";
import ChoiceResultPage from "@pages/results/ChoiceResultPage";
import VoteResultPage from "@pages/results/VoteResultPage";
import { useFrontendTest } from "../FrontendTestContext";
import { createIntermediateResult } from "../testSession";

const Round = ({ round, session, onSaveAnswer, onCompleteRound, onLeave }) => {
  const [timeLeft, setTimeLeft] = useState(session.roundDuration);
  const [submitted, setSubmitted] = useState(false);
  const [phase, setPhase] = useState("answering");
  const [submittedAnswer, setSubmittedAnswer] = useState(undefined);
  const requiredVoteCount = Math.floor(session.participants.length / 2) + 1;
  const delayedVoteCount = Math.min(round.roundId % 2 === 0 ? 2 : 1, requiredVoteCount - 1);
  const [voteUpdate, setVoteUpdate] = useState(() => ({
    votedCount: Math.max(0, requiredVoteCount - delayedVoteCount - 1),
    requiredCount: requiredVoteCount,
  }));
  const [votedForNextRound, setVotedForNextRound] = useState(false);
  const currentParticipantId = session.participants[0]?.participantId;
  const isQuestionTarget =
    round.qType !== "COMMON_VOTE" && round.targetId === currentParticipantId;

  const finishAnswering = useCallback((answer) => {
    if (phase !== "answering") return;
    console.info("[Frontend Test] round completed", {
      roundId: round.roundId,
      qType: round.qType,
      answer,
    });
    setSubmitted(true);
    setSubmittedAnswer(answer);
    onSaveAnswer(round.roundId, answer);
    window.setTimeout(() => setPhase("result"), 500);
  }, [onSaveAnswer, phase, round]);

  useEffect(() => {
    if (phase !== "answering") return undefined;
    const timer = window.setTimeout(() => {
      if (timeLeft <= 1) finishAnswering(null);
      else setTimeLeft((previous) => previous - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [finishAnswering, phase, timeLeft]);

  useEffect(() => {
    if (!votedForNextRound || voteUpdate.votedCount >= voteUpdate.requiredCount) {
      return undefined;
    }

    const nextVoteTimer = window.setTimeout(() => {
      setVoteUpdate((previous) => ({
        ...previous,
        votedCount: Math.min(previous.votedCount + 1, previous.requiredCount),
      }));
    }, 850);

    return () => window.clearTimeout(nextVoteTimer);
  }, [voteUpdate, votedForNextRound]);

  useEffect(() => {
    if (!votedForNextRound || voteUpdate.votedCount < voteUpdate.requiredCount) {
      return undefined;
    }

    const completeTimer = window.setTimeout(onCompleteRound, 650);
    return () => window.clearTimeout(completeTimer);
  }, [onCompleteRound, voteUpdate, votedForNextRound]);

  const handleVoteNextRound = useCallback(() => {
    if (votedForNextRound) return;

    setVotedForNextRound(true);
    setVoteUpdate((previous) => ({
      ...previous,
      votedCount: Math.min(previous.votedCount + 1, previous.requiredCount),
    }));
  }, [votedForNextRound]);

  if (phase === "result") {
    const result = createIntermediateResult(round, session.participants, submittedAnswer);
    const resultProps = {
      roomName: session.roomName,
      question: round.question,
      voteUpdate,
      onNext: handleVoteNextRound,
      onLeave,
    };

    if (round.qType === "BLANK") {
      return (
        <AnswerResultPage
          {...resultProps}
          targetName={round.targetName}
          answers={result.answers}
        />
      );
    }

    if (round.qType === "INDIVIDUAL_OX") {
      return (
        <ChoiceResultPage
          {...resultProps}
          targetName={round.targetName}
          optionResults={result.optionResults}
          targetAnswerOptionId={result.targetAnswerOptionId}
          mostSelectedOptionIds={result.mostSelectedOptionIds}
          mySelectedOptionId={result.mySelectedOptionId}
        />
      );
    }

    return <VoteResultPage {...resultProps} votes={result.votes} />;
  }

  const commonProps = {
    roomName: session.roomName,
    timeLeft,
    submitted,
    onLeave,
  };

  if (round.qType === "BLANK") {
    return (
      <PersonalAnswerGamePage
        {...commonProps}
        targetName={round.targetName}
        question={round.question}
        isQuestionTarget={isQuestionTarget}
        onSubmit={finishAnswering}
      />
    );
  }

  if (round.qType === "INDIVIDUAL_OX") {
    return (
      <PersonalChoiceGamePage
        {...commonProps}
        targetName={round.targetName}
        question={round.question}
        options={round.options}
        isQuestionTarget={isQuestionTarget}
        onSubmit={finishAnswering}
      />
    );
  }

  return (
    <GeneralChoiceGamePage
      {...commonProps}
      question={round.question}
      participants={session.participants}
      onSubmit={finishAnswering}
    />
  );
};

const FrontendTestGamePage = () => {
  const navigate = useNavigate();
  const { session, roundIndex, saveAnswer, moveToNextRound, resetSession } = useFrontendTest();
  const round = session.rounds[roundIndex];

  const handleLeave = () => {
    resetSession();
    navigate("/", { replace: true });
  };

  const handleCompleteRound = () => {
    const hasNextRound = roundIndex + 1 < session.rounds.length;

    if (hasNextRound) moveToNextRound();
    navigate("/loading", {
      state: { nextPath: hasNextRound ? "/game" : "/end" },
    });
  };

  return (
    <Round
      key={round.roundId}
      round={round}
      session={session}
      onSaveAnswer={saveAnswer}
      onCompleteRound={handleCompleteRound}
      onLeave={handleLeave}
    />
  );
};

export default FrontendTestGamePage;
