// RoomAPI.getResult 응답 -> 결과지 카드 목록으로 가공하는 순수 함수들.
// GameResultPage(실제 플로우)와 TestPage(목 데이터 미리보기)가 함께 쓴다.

export const ACCURACY_TIER = Object.freeze({
  LOW: "LOW",
  MIDDLE: "MIDDLE",
  HIGH: "HIGH",
});

// JSON 응답에서 같은 ID가 숫자/문자열로 섞여 와도 동일한 선지로 취급한다.
export const isSameOptionId = (left, right) =>
  left != null && right != null && String(left) === String(right);

const getOptionId = (option) => option?.optionId ?? option?.id;
const getOptionContent = (option) => option?.content ?? option?.optionContent ?? option?.text;
const getVoteParticipantId = (vote) => vote?.participantId ?? vote?.targetParticipantId;
const getVoteParticipantName = (vote) => vote?.participantName ?? vote?.name;

const findParticipantVote = (votes, participantId, participantName) =>
  votes.find((vote) => isSameOptionId(getVoteParticipantId(vote), participantId)) ??
  votes.find(
    (vote) => participantName && getVoteParticipantName(vote) === participantName,
  );

// 서버가 DB의 rank를 내려주면 그대로 사용한다. rank가 없는 응답만 득표수 기준으로
// 경쟁 순위(1, 2, 2, 4)를 계산하며, 배열 정렬 순서에는 의존하지 않는다.
export const resolveVoteRank = (votes = [], participantId, participantName) => {
  const targetVote = findParticipantVote(votes, participantId, participantName);
  // 서버 집계는 득표한 참가자만 votes에 포함한다. 대상자가 목록에 없으면 0표로 보고,
  // 0표보다 많이 받은 참가자 수 다음의 공동 순위를 부여한다.
  if (!targetVote) {
    if (participantId == null && !participantName) return null;
    return 1 + votes.filter((vote) => (Number(vote.count) || 0) > 0).length;
  }

  const serverRank = Number(targetVote.rank);
  if (Number.isInteger(serverRank) && serverRank > 0) return serverRank;

  const targetCount = Number(targetVote.count) || 0;
  return 1 + votes.filter((vote) => (Number(vote.count) || 0) > targetCount).length;
};

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

  return rounds
    .filter((round) => round.qType !== "COMMON_VOTE")
    .map((round) => {
      const roundResult = round.result ?? {};
      const optionResults = roundResult.optionResults ?? [];
      const totalCount = optionResults.reduce((sum, option) => sum + (option.count ?? 0), 0);
      const targetAnswerOptionId =
        roundResult.targetAnswerOptionId ??
        roundResult.correctOptionId ??
        roundResult.answerOptionId;
      const trueAnswerOption = optionResults.find(
        (option) => isSameOptionId(getOptionId(option), targetAnswerOptionId),
      );
      const mostSelectedOptionIds = roundResult.mostSelectedOptionIds ?? [];
      const mostVotedOption = optionResults.find((option) =>
        mostSelectedOptionIds.some((id) => isSameOptionId(id, getOptionId(option))),
      );
      const trueAnswer =
        getOptionContent(trueAnswerOption) ??
        roundResult.targetAnswerOptionContent ??
        roundResult.correctAnswer ??
        roundResult.trueAnswer;
      const correctSubmitterCount = roundResult.correctSubmitters?.length ?? 0;
      const wrongSubmitterCount = roundResult.wrongSubmitters?.length ?? 0;
      const hasSubmitterSummary =
        Array.isArray(roundResult.correctSubmitters) ||
        Array.isArray(roundResult.wrongSubmitters);
      const commonVotes = commonRound?.result?.votes ?? [];
      const participantVote = findParticipantVote(
        commonVotes,
        round.targetId,
        round.targetName,
      );
      const commonResult = commonRound
        ? {
            roundId: commonRound.roundId,
            question: commonRound.question,
            totalVotes: commonVotes.reduce(
              (sum, entry) => sum + (Number(entry.count) || 0),
              0,
            ),
            voteCount: Number(participantVote?.count) || 0,
            rank: resolveVoteRank(commonVotes, round.targetId, round.targetName),
          }
        : null;

      return {
        roundId: round.roundId,
        qType: round.qType,
        targetName: round.targetName,
        question: round.question,
        answers: roundResult.answers,
        trueAnswer,
        mostVotedOption: getOptionContent(mostVotedOption),
        mostVotedCount: mostVotedOption?.count,
        totalOptionVotes: totalCount,
        // 객관식 당사자의 선택은 정답을 결정하기 위해 필요하지만 정답자 수에는 포함하지 않는다.
        correctCount: hasSubmitterSummary
          ? correctSubmitterCount
          : Math.max(0, (trueAnswerOption?.count ?? 0) - 1),
        totalCount,
        eligibleAnswerCount: hasSubmitterSummary
          ? correctSubmitterCount + wrongSubmitterCount
          : participantCount > 0
            ? Math.max(0, participantCount - 1)
            : totalCount,
        commonResult,
      };
    });
};
