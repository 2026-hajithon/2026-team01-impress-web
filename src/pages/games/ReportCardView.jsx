import { forwardRef } from "react";
import ResultCard from "./ResultCard";
import AnswerReportCard from "./AnswerReportCard";
import ChoiceReportCard from "./ChoiceReportCard";
import CommonVoteSection from "./CommonVoteSection";
import { mostVotedOptionOf } from "./reportCards";

// buildReportCards()가 만든 카드 1장(주관식 또는 객관식 + 공동질문)을 실제로 그린다.
const ReportCardView = forwardRef(({ roomName, date, card }, ref) => {
  const { option: mostVotedOption, count: mostVotedCount } = mostVotedOptionOf(card.optionCounts);

  return (
    <ResultCard ref={ref} roomName={roomName} participantName={card.targetName} date={date}>
      {card.qType === "BLANK" ? (
        <AnswerReportCard question={card.question} answers={card.answers} />
      ) : (
        <ChoiceReportCard
          question={card.question}
          trueAnswer={card.trueAnswer}
          mostVotedOption={mostVotedOption}
          mostVotedCount={mostVotedCount}
          totalVotes={Object.values(card.optionCounts ?? {}).reduce((sum, count) => sum + count, 0)}
          correctCount={card.correctCount}
          totalCount={card.correctCount + card.wrongCount}
        />
      )}
      <CommonVoteSection
        question={card.commonQuestion}
        totalVotes={card.commonTotalVotes}
        topVotes={card.commonTopVotes}
        stampNumber={card.stampNumber}
      />
    </ResultCard>
  );
});

ReportCardView.displayName = "ReportCardView";

export default ReportCardView;
