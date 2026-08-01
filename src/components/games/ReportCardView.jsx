import { forwardRef } from "react";
import ResultCard from "./ResultCard";
import AnswerReportCard from "./AnswerReportCard";
import ChoiceReportCard from "./ChoiceReportCard";
import CommonVoteSection from "./CommonVoteSection";

// buildReportCards()가 만든 카드 1장(주관식 또는 객관식 + 공동질문)을 실제로 그린다.
const ReportCardView = forwardRef(({ roomName, date, card }, ref) => {
  return (
    <ResultCard ref={ref} roomName={roomName} participantName={card.targetName} date={date}>
      {card.qType === "BLANK" ? (
        <AnswerReportCard question={card.question} answers={card.answers} />
      ) : (
        <ChoiceReportCard
          question={card.question}
          trueAnswer={card.trueAnswer}
          mostVotedOption={card.mostVotedOption}
          mostVotedCount={card.mostVotedCount}
          totalVotes={card.totalOptionVotes}
          correctCount={card.correctCount}
          eligibleAnswerCount={card.eligibleAnswerCount}
        />
      )}
      {card.commonResult && (
        <CommonVoteSection
          question={card.commonResult.question}
          totalVotes={card.commonResult.totalVotes}
          voteCount={card.commonResult.voteCount}
          rank={card.commonResult.rank}
        />
      )}
    </ResultCard>
  );
});

ReportCardView.displayName = "ReportCardView";

export default ReportCardView;
