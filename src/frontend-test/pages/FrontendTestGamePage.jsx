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
  const [result, setResult] = useState(null);

  const finishAnswering = useCallback((answer) => {
    if (phase !== "answering") return;
    const nextResult = createIntermediateResult(round, session.participants, answer);

    console.info("[Frontend Test] round completed", {
      roundId: round.roundId,
      qType: round.qType,
      answer,
    });
    setSubmitted(true);
    onSaveAnswer(round.roundId, answer);
    setResult(nextResult);
    window.setTimeout(() => setPhase("result"), 500);
  }, [onSaveAnswer, phase, round, session.participants]);

  useEffect(() => {
    if (phase !== "answering") return undefined;
    const timer = window.setTimeout(() => {
      if (timeLeft <= 1) finishAnswering(null);
      else setTimeLeft((previous) => previous - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [finishAnswering, phase, timeLeft]);

  if (phase === "result") {
    const fallbackResult = createIntermediateResult(round, session.participants, null);
    const resultProps = {
      roomName: session.roomName,
      question: round.question,
      voteUpdate: {
        votedCount: Math.floor(session.participants.length / 2) + 1,
        requiredCount: Math.floor(session.participants.length / 2) + 1,
      },
      onNext: onCompleteRound,
      onLeave,
    };

    if (round.qType === "BLANK") {
      return (
        <AnswerResultPage
          {...resultProps}
          targetName={round.targetName}
          answers={result?.answers ?? fallbackResult.answers}
        />
      );
    }

    if (round.qType === "INDIVIDUAL_OX") {
      return (
        <ChoiceResultPage
          {...resultProps}
          targetName={round.targetName}
          options={result?.options ?? fallbackResult.options}
          counts={result?.counts ?? fallbackResult.counts}
          trueAnswer={result?.trueAnswer ?? fallbackResult.trueAnswer}
          myAnswer={result?.myAnswer ?? fallbackResult.myAnswer}
        />
      );
    }

    return <VoteResultPage {...resultProps} ranking={result?.ranking ?? fallbackResult.ranking} />;
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
