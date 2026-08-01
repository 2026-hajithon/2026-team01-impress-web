// RoomAPI.getResult 응답 -> 결과지 카드 목록으로 가공하는 순수 함수들.
// GameResultPage(실제 플로우)와 TestPage(목 데이터 미리보기)가 함께 쓴다.

// result.rounds -> 화면에 그릴 결과지 카드 목록으로 가공한다.
// BLANK/INDIVIDUAL_CHOICE 라운드마다 카드 1장을 만들고, COMMON_VOTE 라운드는 모든 카드 하단에 공통으로 붙인다.
export const buildReportCards = (result) => {
  const rounds = result.rounds ?? [];
  const commonRound = rounds.find((round) => round.qType === "COMMON_VOTE");
  const votes = commonRound?.result?.votes ?? [];
  const commonTotalVotes = votes.reduce((sum, entry) => sum + (entry.count ?? 0), 0);
  const commonTopVotes = Math.max(0, ...votes.map((entry) => entry.count ?? 0));

  return rounds
    .filter((round) => round.qType !== "COMMON_VOTE")
    .map((round, index) => {
      const roundResult = round.result ?? {};
      const optionResults = roundResult.optionResults ?? [];
      const totalCount = optionResults.reduce((sum, option) => sum + (option.count ?? 0), 0);
      const trueAnswerOption = optionResults.find(
        (option) => option.optionId === roundResult.targetAnswerOptionId,
      );
      const mostVotedOption = optionResults.find((option) =>
        (roundResult.mostSelectedOptionIds ?? []).includes(option.optionId),
      );

      return {
        roundId: round.roundId,
        qType: round.qType,
        targetName: round.targetName,
        question: round.question,
        answers: roundResult.answers,
        trueAnswer: trueAnswerOption?.content,
        mostVotedOption: mostVotedOption?.content,
        mostVotedCount: mostVotedOption?.count,
        totalOptionVotes: totalCount,
        correctCount: trueAnswerOption?.count ?? 0,
        totalCount,
        commonQuestion: commonRound?.question,
        commonTotalVotes,
        commonTopVotes,
        stampNumber: index + 1,
      };
    });
};
