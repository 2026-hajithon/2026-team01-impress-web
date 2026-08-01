const MEMBER_NAMES = ["김가빈", "김수현", "이혁", "윤소연", "유영주", "김이픈", "최두지"];

export const PERSONAL_OPTIONS = ["남매", "자매", "외동", "형제"].map((content, index) => ({
  optionId: content,
  content,
  displayOrder: index + 1,
}));

const makePersonalRound = (participant, index, totalRounds, qType) => {
  return {
    roundId: index + 1,
    roundOrder: index + 1,
    totalRounds,
    qType,
    targetId: participant.participantId,
    targetName: participant.name,
    question:
      qType === "BLANK"
        ? "이 사람은 주말에 ____를 할 것 같은 인상이다!"
        : "이 사람의 형제관계는\n어떻게 될까?",
    options: PERSONAL_OPTIONS,
  };
};

export const createTestSession = ({ hostName, roomName, participantCount, roundDuration }) => {
  const participants = Array.from({ length: participantCount }, (_, index) => ({
    participantId: index + 1,
    name: index === 0 ? hostName : MEMBER_NAMES[index - 1],
    role: index === 0 ? "HOST" : "MEMBER",
  }));
  const totalRounds = participants.length + 1;
  const firstQuestionType = Math.random() < 0.5 ? "BLANK" : "INDIVIDUAL_OX";
  const secondQuestionType = firstQuestionType === "BLANK" ? "INDIVIDUAL_OX" : "BLANK";

  return {
    roomCode: "FRONT-ONLY",
    roomName,
    hostName,
    roundDuration,
    participants,
    rounds: [
      ...participants.map((participant, index) =>
        makePersonalRound(
          participant,
          index,
          totalRounds,
          index % 2 === 0 ? firstQuestionType : secondQuestionType,
        ),
      ),
      {
        roundId: totalRounds,
        roundOrder: totalRounds,
        totalRounds,
        qType: "COMMON_VOTE",
        question: "어렸을 때, 가장 엄마 말을\n안들었을 것 같은 사람은?",
      },
    ],
  };
};

const makeTextAnswers = (participants, submittedAnswer) =>
  participants.map((participant, index) => ({
    submitterId: participant.participantId,
    submitterName: participant.name,
    textAnswer:
      index === 0 && submittedAnswer
        ? submittedAnswer
        : ["카페에서 조용히 공부", "계획 없이 드라이브", "집에서 영화 보기", "하루 종일 게임"][
            index % 4
          ],
  }));

export const createIntermediateResult = (round, participants, answer) => {
  if (round.qType === "BLANK") {
    return { answers: makeTextAnswers(participants, answer) };
  }

  if (round.qType === "INDIVIDUAL_OX") {
    const optionNames = round.options.map((option) => option.content);
    return {
      options: optionNames,
      counts: Object.fromEntries(optionNames.map((option, index) => [option, index === 0 ? participants.length - 1 : 0])),
      trueAnswer: optionNames[0],
      myAnswer: answer,
    };
  }

  return {
    ranking: participants.map((participant, index) => ({
      participantId: participant.participantId,
      name: participant.name,
      votes: participant.participantId === answer ? participants.length : Math.max(0, participants.length - index - 2),
    })).sort((a, b) => b.votes - a.votes),
  };
};

export const createFinalResult = (session, answers) => ({
  roomCode: session.roomCode,
  roomName: session.roomName,
  gameSessionId: 1,
  participants: session.participants,
  rounds: session.rounds.map((round) => {
    const answer = answers[round.roundId];

    if (round.qType === "BLANK") {
      return {
        ...round,
        result: { answers: makeTextAnswers(session.participants, answer) },
      };
    }

    if (round.qType === "INDIVIDUAL_OX") {
      const optionResults = round.options.map((option, index) => ({
        optionId: option.optionId,
        content: option.content,
        count: index === 0 ? Math.max(1, session.participants.length - 1) : index === 1 ? 1 : 0,
      }));

      return {
        ...round,
        result: {
          optionResults,
          targetAnswerOptionId: round.options[0].optionId,
          mostSelectedOptionIds: [round.options[0].optionId],
        },
      };
    }

    return {
      ...round,
      result: {
        votes: session.participants.map((participant, index) => ({
          participantId: participant.participantId,
          count: participant.participantId === answer ? session.participants.length : Math.max(0, 2 - index),
        })),
      },
    };
  }),
});
