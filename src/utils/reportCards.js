// RoomAPI.getResult 응답 -> 결과지 카드 목록으로 가공하는 순수 함수들.
// GameResultPage(실제 플로우)와 TestPage(목 데이터 미리보기)가 함께 쓴다.

// result.rounds -> 화면에 그릴 결과지 카드 목록으로 가공한다.
// BLANK/INDIVIDUAL_OX 라운드마다 카드 1장을 만들고, COMMON_VOTE 라운드는 모든 카드 하단에 공통으로 붙인다.
export const buildReportCards = (result) => {
  const rounds = result.rounds ?? [];
  const commonRound = rounds.find((round) => round.qType === "COMMON_VOTE");
  const ranking = commonRound?.result?.ranking ?? [];
  const totalVotes = ranking.reduce((sum, entry) => sum + (entry.votes ?? 0), 0);
  const topVotes = ranking[0]?.votes ?? 0;

  return rounds
    .filter((round) => round.qType !== "COMMON_VOTE")
    .map((round, index) => ({
      roundId: round.roundId,
      qType: round.qType,
      targetName: round.targetName,
      question: round.question,
      answers: round.result?.answers,
      trueAnswer: round.result?.trueAnswer,
      optionCounts: round.result?.optionCounts,
      correctCount: round.result?.correctSubmitters?.length ?? 0,
      wrongCount: round.result?.wrongSubmitters?.length ?? 0,
      commonQuestion: commonRound?.question,
      commonTotalVotes: totalVotes,
      commonTopVotes: topVotes,
      stampNumber: index + 1,
    }));
};

export const mostVotedOptionOf = (optionCounts = {}) => {
  const entries = Object.entries(optionCounts);
  if (entries.length === 0) return {};
  const [option, count] = entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  return { option, count };
};
