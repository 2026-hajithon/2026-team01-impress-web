// 웹소켓 서버에 연결하지 못했을 때(로컬에 백엔드가 안 떠 있는 경우 등) 화면을 계속 개발/확인할 수 있도록
// useRoomSocket이 자동으로 대신 흘려보내는 목 데이터. 실제 서버 응답 스펙이 확정되면 이 파일만 갱신하면 된다.

export const MOCK_PARTICIPANTS = [
  { participantId: 1, name: "김태현", role: "HOST", connectionStatus: "CONNECTED" },
  { participantId: 2, name: "김가빈", role: "GUEST", connectionStatus: "CONNECTED" },
  { participantId: 3, name: "김수현", role: "GUEST", connectionStatus: "CONNECTED" },
  { participantId: 4, name: "이혁", role: "GUEST", connectionStatus: "CONNECTED" },
  { participantId: 5, name: "윤소연", role: "GUEST", connectionStatus: "CONNECTED" },
  { participantId: 6, name: "유영주", role: "GUEST", connectionStatus: "CONNECTED" },
];

const TOTAL_ROUNDS = 3;

const CHOICE_OPTIONS = [
  { optionId: 11, content: "남매", displayOrder: 1 },
  { optionId: 12, content: "자매", displayOrder: 2 },
  { optionId: 13, content: "외동", displayOrder: 3 },
  { optionId: 14, content: "형제", displayOrder: 4 },
];

export const MOCK_ROUNDS = {
  BLANK: {
    roundId: 1001,
    roundOrder: 1,
    totalRounds: TOTAL_ROUNDS,
    qType: "BLANK",
    phase: "ANSWERING",
    timeLimit: 60,
    myAnswerSubmitted: false,
    question: "이 사람은 주말에 ____를 할 것 같은 인상이다!",
    targetId: 1,
  },
  INDIVIDUAL_CHOICE: {
    roundId: 1002,
    roundOrder: 2,
    totalRounds: TOTAL_ROUNDS,
    qType: "INDIVIDUAL_CHOICE",
    phase: "ANSWERING",
    timeLimit: 60,
    myAnswerSubmitted: false,
    question: "이 사람의 형제관계는\n어떻게 될까?",
    targetId: 1,
    options: CHOICE_OPTIONS,
  },
  COMMON_VOTE: {
    roundId: 1003,
    roundOrder: 3,
    totalRounds: TOTAL_ROUNDS,
    qType: "COMMON_VOTE",
    phase: "ANSWERING",
    timeLimit: 60,
    myAnswerSubmitted: false,
    question: "어렸을 때, 가장 엄마 말을 안들었을 것 같은 사람은?",
  },
};

// options 목록에 totalVotes표를 무작위로 나눠 담아 optionId -> count 형태로 만든다.
const distributeVotes = (options, totalVotes) => {
  const counts = options.map(() => 0);

  for (let i = 0; i < totalVotes; i += 1) {
    counts[Math.floor(Math.random() * options.length)] += 1;
  }

  return options.map((option, idx) => ({ ...option, count: counts[idx] }));
};

const mostSelectedOptionIdsOf = (optionResults) => {
  const maxCount = Math.max(0, ...optionResults.map((option) => option.count));
  if (maxCount === 0) return [];
  return optionResults.filter((option) => option.count === maxCount).map((option) => option.optionId);
};

export const MOCK_RESULTS = {
  BLANK: {
    roundId: MOCK_ROUNDS.BLANK.roundId,
    qType: "BLANK",
    phase: "RESULT",
    question: MOCK_ROUNDS.BLANK.question,
    targetId: 1,
    result: {
      answers: [
        { submitterId: 1, submitterName: "김태현", textAnswer: "카페에서 커피마시면서 조용히 공부" },
        { submitterId: 2, submitterName: "김가빈", textAnswer: "계획 없이 차타고 놀러가기" },
        {
          submitterId: 4,
          submitterName: "이혁",
          textAnswer: "집에서 좋아하는 영화를 보면서 맛있는 음식을 시켜 먹을",
        },
        { submitterId: 6, submitterName: "유영주", textAnswer: "하루종일 게임만 쳐다보고 있을" },
      ],
    },
  },
  INDIVIDUAL_CHOICE: {
    roundId: MOCK_ROUNDS.INDIVIDUAL_CHOICE.roundId,
    qType: "INDIVIDUAL_CHOICE",
    phase: "RESULT",
    question: MOCK_ROUNDS.INDIVIDUAL_CHOICE.question,
    targetId: 1,
    result: {
      targetAnswerOptionId: 11,
      mostSelectedOptionIds: [11],
      optionResults: CHOICE_OPTIONS.map((option) => ({
        ...option,
        count: option.optionId === 11 ? 3 : 0,
      })),
    },
  },
  COMMON_VOTE: {
    roundId: MOCK_ROUNDS.COMMON_VOTE.roundId,
    qType: "COMMON_VOTE",
    phase: "RESULT",
    question: MOCK_ROUNDS.COMMON_VOTE.question,
    result: {
      votes: [
        { participantId: 1, participantName: "김태현", count: 4 },
        { participantId: 2, participantName: "김가빈", count: 3 },
        { participantId: 3, participantName: "김수현", count: 2 },
        { participantId: 4, participantName: "이혁", count: 1 },
        { participantId: 5, participantName: "윤소연", count: 0 },
        { participantId: 6, participantName: "유영주", count: 0 },
      ],
    },
  },
};

// GameRoundPage가 순서대로 순환하며 보여줄 라운드 목록 (BLANK -> INDIVIDUAL_CHOICE -> COMMON_VOTE -> 게임 종료)
export const MOCK_ROUND_SEQUENCE = ["BLANK", "INDIVIDUAL_CHOICE", "COMMON_VOTE"];

// API 없이 방장 플로우를 확인할 때 쓰는 한 판 분량의 라운드다.
// 참가자마다 개인 질문을 정확히 한 번씩 배정하고, 마지막에 공통 질문 하나를 붙인다.
// 개인 질문 유형은 실제 게임 규칙처럼 매 게임마다 주관식/객관식 중 무작위로 정한다.
export const createMockGameRounds = (participants = MOCK_PARTICIPANTS) => {
  const totalRounds = participants.length + 1;
  const personalRounds = participants.map((participant, index) => {
    const qType = Math.random() < 0.5 ? "BLANK" : "INDIVIDUAL_CHOICE";

    return {
      ...MOCK_ROUNDS[qType],
      roundId: 2001 + index,
      roundOrder: index + 1,
      totalRounds,
      qType,
      targetId: participant.participantId,
    };
  });

  return [
    ...personalRounds,
    {
      ...MOCK_ROUNDS.COMMON_VOTE,
      roundId: 2001 + participants.length,
      roundOrder: totalRounds,
      totalRounds,
    },
  ];
};

export const createMockRoundResult = (round, participants = MOCK_PARTICIPANTS) => {
  const baseResult = MOCK_RESULTS[round.qType];

  if (round.qType === "COMMON_VOTE") {
    return {
      ...baseResult,
      roundId: round.roundId,
      question: round.question,
      result: {
        votes: participants.map((participant, index) => ({
          participantId: participant.participantId,
          participantName: participant.name,
          count: Math.max(0, participants.length - index - 1),
        })),
      },
    };
  }

  if (round.qType === "INDIVIDUAL_CHOICE") {
    const options = round.options ?? CHOICE_OPTIONS;
    const optionResults = distributeVotes(options, participants.length);

    return {
      ...baseResult,
      roundId: round.roundId,
      question: round.question,
      targetId: round.targetId,
      result: {
        targetAnswerOptionId: options[0].optionId,
        mostSelectedOptionIds: mostSelectedOptionIdsOf(optionResults),
        optionResults,
      },
    };
  }

  return {
    ...baseResult,
    roundId: round.roundId,
    question: round.question,
    targetId: round.targetId,
  };
};

// RoomAPI.getResult 실패 시(백엔드 미기동 등) GameResultPage가 대신 흘려보내는 목 최종 결과.
export const MOCK_FINAL_RESULT = {
  roomCode: "MOCK01",
  roomName: "하지톤 1팀",
  gameSessionId: 1,
  participants: MOCK_PARTICIPANTS,
  rounds: [
    {
      roundId: 1001,
      roundOrder: 1,
      qType: "BLANK",
      targetId: 1,
      targetName: "김태현",
      question: "이 사람은 주말에 ____를 할 것 같은 인상이다!",
      result: {
        answers: [
          { submitterId: 1, submitterName: "김태현", textAnswer: "카페에서 커피마시면서 조용히 공부" },
          { submitterId: 2, submitterName: "김가빈", textAnswer: "계획 없이 차타고 놀러가기" },
          {
            submitterId: 4,
            submitterName: "이혁",
            textAnswer: "집에서 좋아하는 영화를 보면서 맛있는 음식을 시켜 먹을",
          },
          { submitterId: 6, submitterName: "유영주", textAnswer: "하루종일 게임만 쳐다보고 있을" },
        ],
      },
    },
    {
      roundId: 1002,
      roundOrder: 2,
      qType: "INDIVIDUAL_CHOICE",
      targetId: 1,
      targetName: "김태현",
      question: "이 사람의 형제관계는\n어떻게 될까?",
      result: {
        targetAnswerOptionId: 11,
        mostSelectedOptionIds: [12],
        optionResults: [
          { optionId: 11, content: "남매", displayOrder: 1, count: 2 },
          { optionId: 12, content: "자매", displayOrder: 2, count: 5 },
          { optionId: 13, content: "외동", displayOrder: 3, count: 0 },
          { optionId: 14, content: "형제", displayOrder: 4, count: 0 },
        ],
      },
    },
    {
      roundId: 1003,
      roundOrder: 3,
      qType: "COMMON_VOTE",
      question: "어렸을 때, 가장 엄마 말을\n안들었을 것 같은 사람은?",
      result: {
        votes: [
          { participantId: 1, participantName: "김태현", count: 3 },
          { participantId: 2, participantName: "김가빈", count: 2 },
          { participantId: 3, participantName: "김수현", count: 1 },
          { participantId: 4, participantName: "이혁", count: 1 },
          { participantId: 5, participantName: "윤소연", count: 0 },
          { participantId: 6, participantName: "유영주", count: 0 },
        ],
      },
    },
  ],
};
