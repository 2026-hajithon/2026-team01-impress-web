// RoomAPI.getResult 응답 -> 결과지 카드 목록으로 가공하는 순수 함수들.
// GameResultPage(실제 플로우)와 TestPage(목 데이터 미리보기)가 함께 쓴다.

export const ACCURACY_TIER = Object.freeze({
  LOW: "LOW",
  MIDDLE: "MIDDLE",
  HIGH: "HIGH",
});

// 개인 객관식은 문제 당사자를 제외한 답변 가능 인원을 3등분한다.
// 예: 답변 가능 7명 -> 0~2 LOW, 3~4 MIDDLE, 5~7 HIGH.
export const getAccuracyTier = (correctCount, eligibleAnswerCount) => {
  if (eligibleAnswerCount <= 0) return ACCURACY_TIER.LOW;

  const lowMax = Math.floor(eligibleAnswerCount / 3);
  const middleMax = Math.floor((eligibleAnswerCount * 2) / 3);

  if (correctCount > middleMax) return ACCURACY_TIER.HIGH;
  if (correctCount > lowMax) return ACCURACY_TIER.MIDDLE;
  return ACCURACY_TIER.LOW;
};

// result.rounds -> 화면에 그릴 결과지 카드 목록으로 가공한다.
// BLANK/INDIVIDUAL_CHOICE 라운드마다 카드 1장을 만들고, COMMON_VOTE 라운드는 모든 카드 하단에 공통으로 붙인다.
export const buildReportCards = (result) => {
  const rounds = result.rounds ?? [];
  const participantCount = result.participants?.length ?? 0;
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
        // 객관식 당사자의 선택은 정답을 결정하기 위해 필요하지만 정답자 수에는 포함하지 않는다.
        correctCount: Math.max(0, (trueAnswerOption?.count ?? 0) - 1),
        totalCount,
        eligibleAnswerCount: participantCount > 0
          ? Math.max(0, participantCount - 1)
          : totalCount,
        commonQuestion: commonRound?.question,
        commonTotalVotes,
        commonTopVotes,
        stampNumber: index + 1,
      };
    });
};
