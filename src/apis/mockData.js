// 웹소켓 서버에 연결하지 못했을 때(로컬에 백엔드가 안 떠 있는 경우 등) 화면을 계속 개발/확인할 수 있도록
// useRoomSocket이 자동으로 대신 흘려보내는 목 데이터. 실제 서버 응답 스펙이 확정되면 이 파일만 갱신하면 된다.

export const MOCK_PARTICIPANTS = [
  { participantId: 1, name: "김태현", role: "HOST", connectionStatus: "CONNECTED" },
  { participantId: 2, name: "김가빈", role: "MEMBER", connectionStatus: "CONNECTED" },
  { participantId: 3, name: "김수현", role: "MEMBER", connectionStatus: "CONNECTED" },
  { participantId: 4, name: "이혁", role: "MEMBER", connectionStatus: "CONNECTED" },
  { participantId: 5, name: "윤소연", role: "MEMBER", connectionStatus: "CONNECTED" },
  { participantId: 6, name: "유영주", role: "MEMBER", connectionStatus: "CONNECTED" },
];

const TOTAL_ROUNDS = 3;

export const MOCK_ROUNDS = {
  BLANK: {
    roundId: 1001,
    roundOrder: 1,
    totalRounds: TOTAL_ROUNDS,
    qType: "BLANK",
    phase: "ANSWERING",
    timeRemaining: 60,
    myAnswerSubmitted: false,
    question: "이 사람은 주말에 ____를 할 것 같은 인상이다!",
    targetId: 1,
  },
  INDIVIDUAL_OX: {
    roundId: 1002,
    roundOrder: 2,
    totalRounds: TOTAL_ROUNDS,
    qType: "INDIVIDUAL_OX",
    phase: "ANSWERING",
    timeRemaining: 60,
    myAnswerSubmitted: false,
    question: "이 사람의 형제관계는\n어떻게 될까?",
    targetId: 1,
    options: ["남매", "자매", "외동", "형제"],
  },
  COMMON_VOTE: {
    roundId: 1003,
    roundOrder: 3,
    totalRounds: TOTAL_ROUNDS,
    qType: "COMMON_VOTE",
    phase: "ANSWERING",
    timeRemaining: 60,
    myAnswerSubmitted: false,
    question: "어렸을 때, 가장 엄마 말을 안들었을 것 같은 사람은?",
  },
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
  INDIVIDUAL_OX: {
    roundId: MOCK_ROUNDS.INDIVIDUAL_OX.roundId,
    qType: "INDIVIDUAL_OX",
    phase: "RESULT",
    question: MOCK_ROUNDS.INDIVIDUAL_OX.question,
    targetId: 1,
    result: {
      trueAnswer: "남매",
      optionCounts: { 남매: 3, 자매: 0, 외동: 0, 형제: 0 },
    },
  },
  COMMON_VOTE: {
    roundId: MOCK_ROUNDS.COMMON_VOTE.roundId,
    qType: "COMMON_VOTE",
    phase: "RESULT",
    question: MOCK_ROUNDS.COMMON_VOTE.question,
    result: {
      ranking: [
        { participantId: 1, name: "김태현", votes: 4 },
        { participantId: 2, name: "김가빈", votes: 3 },
        { participantId: 3, name: "김수현", votes: 2 },
        { participantId: 4, name: "이혁", votes: 1 },
        { participantId: 5, name: "윤소연", votes: 0 },
        { participantId: 6, name: "유영주", votes: 0 },
      ],
    },
  },
};

// GameRoundPage가 순서대로 순환하며 보여줄 라운드 목록 (BLANK -> INDIVIDUAL_OX -> COMMON_VOTE -> 게임 종료)
export const MOCK_ROUND_SEQUENCE = ["BLANK", "INDIVIDUAL_OX", "COMMON_VOTE"];
