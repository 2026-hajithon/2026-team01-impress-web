import PersonalAnswerGamePage from "./games/PersonalAnswerGamePage";
import PersonalChoiceGamePage from "./games/PersonalChoiceGamePage";
import GeneralChoiceGamePage from "./games/GeneralChoiceGamePage";
import HostLeaveDemo from "./games/HostLeaveDemo";
import AnswerResultPage from "./results/AnswerResultPage";
import ChoiceResultPage from "./results/ChoiceResultPage";
import VoteResultPage from "./results/VoteResultPage";
import ReportCardView from "@components/games/ReportCardView";
import { buildReportCards } from "@utils/reportCards";
import { MOCK_FINAL_RESULT } from "@apis/mockData";

const ROOM_NAME = "하지톤 1팀";

const MOCK_PARTICIPANTS = [
  { participantId: 1, name: "김태현" },
  { participantId: 2, name: "김가빈" },
  { participantId: 3, name: "김수현" },
  { participantId: 4, name: "이혁" },
  { participantId: 5, name: "윤소연" },
  { participantId: 6, name: "유영주" },
];

// 실제 컴포넌트의 onSubmit/onNext가 진짜로 호출되는지 콘솔에서 바로 확인할 수 있도록 남긴다
// (axiosClient의 콘솔 로그 컨벤션과 동일한 스타일).
const logTestClick = (label, payload) => {
  console.log(`%c[TEST 클릭] ${label}`, "color:#8dacff; font-weight:bold", payload ?? "");
};

const REPORT_CARDS = buildReportCards(MOCK_FINAL_RESULT);
const ANSWER_REPORT_CARD = REPORT_CARDS.find((card) => card.qType === "BLANK");
const CHOICE_REPORT_CARD = REPORT_CARDS.find((card) => card.qType !== "BLANK");

const CHOICE_QUESTION = `이 사람의 형제 관계는\n어떻게 될까?`;
const CHOICE_OPTIONS = ["남매", "자매", "외동", "형제"];
const VOTE_QUESTION = `어렸을 때, 가장 엄마 말을\n안들었을 것 같은 사람은?`;

// 테스트 페이지 메뉴 구조. 케이스마다 실제 화면 컴포넌트에 다른 목 데이터를 꽂아 넣을 뿐,
// 컴포넌트 자체(제출/선택/다음으로 등)는 실제 코드 그대로 동작한다.
export const TEST_CASE_GROUPS = [
  {
    title: "게임 화면 (실시간 진행)",
    cases: [
      {
        id: "game-answer",
        label: "주관식",
        description: "입력 후 제출 → 잠기는지 확인 (방장 나가기 버튼 포함)",
        Component: () => (
          <HostLeaveDemo onConfirm={() => logTestClick("나가기 확정 (방장)")}>
            {(onLeave) => (
              <PersonalAnswerGamePage
                roomName={ROOM_NAME}
                timeLeft={60}
                targetName="김태현"
                question="이 사람은 주말에 ____를 할 것 같은 인상이다!"
                submitted={false}
                onSubmit={(value) => logTestClick("주관식 제출", { value })}
                onLeave={onLeave}
              />
            )}
          </HostLeaveDemo>
        ),
      },
      {
        id: "game-choice",
        label: "객관식",
        description: "선택 → 나머지가 잠기는지 확인 (방장 나가기 버튼 포함)",
        Component: () => (
          <HostLeaveDemo onConfirm={() => logTestClick("나가기 확정 (방장)")}>
            {(onLeave) => (
              <PersonalChoiceGamePage
                roomName={ROOM_NAME}
                timeLeft={60}
                targetName="김태현"
                question={CHOICE_QUESTION}
                options={CHOICE_OPTIONS}
                submitted={false}
                onSubmit={(value) => logTestClick("객관식 선택", { value })}
                onLeave={onLeave}
              />
            )}
          </HostLeaveDemo>
        ),
      },
      {
        id: "game-vote",
        label: "공통",
        description: "참가자 선택 → 나머지가 잠기는지 확인 (방장 나가기 버튼 포함)",
        Component: () => (
          <HostLeaveDemo onConfirm={() => logTestClick("나가기 확정 (방장)")}>
            {(onLeave) => (
              <GeneralChoiceGamePage
                roomName={ROOM_NAME}
                timeLeft={60}
                question={VOTE_QUESTION}
                participants={MOCK_PARTICIPANTS}
                submitted={false}
                onSubmit={(value) => logTestClick("공통 선택", { value })}
                onLeave={onLeave}
              />
            )}
          </HostLeaveDemo>
        ),
      },
    ],
  },
  {
    title: "라운드 중간 결과 · 주관식",
    cases: [
      {
        id: "round-answer",
        label: "답변 결과",
        description: `"다음으로" 클릭 → 대기 중 상태로 바뀌는지 확인`,
        Component: () => (
          <AnswerResultPage
            roomName={ROOM_NAME}
            targetName="김태현"
            question="이 사람은 주말에 ____를 할 것 같은 인상이다!"
            answers={[
              {
                submitterId: 1,
                submitterName: "김태현",
                textAnswer: "카페에서 커피마시면서 조용히 공부",
              },
              { submitterId: 2, submitterName: "김가빈", textAnswer: "계획 없이 차타고 놀러가기" },
              {
                submitterId: 3,
                submitterName: "이혁",
                textAnswer: "집에서 좋아하는 영화를 보면서 맛있는 음식을 시켜 먹을",
              },
              { submitterId: 4, submitterName: "유영주", textAnswer: "하루종일 게임만 쳐다보고 있을" },
            ]}
            voteUpdate={{ votedCount: 2, requiredCount: 4 }}
            onNext={() => logTestClick("주관식 결과 다음으로")}
          />
        ),
      },
    ],
  },
  {
    title: "라운드 중간 결과 · 객관식",
    cases: [
      {
        id: "round-choice-tie",
        label: "Case 1. 질문 주인공 — 정답=최다득표",
        description: "질문 대상이라 답변 안 함, 정답이 곧 최다 득표",
        Component: () => (
          <ChoiceResultPage
            roomName={ROOM_NAME}
            targetName="김태현"
            question={CHOICE_QUESTION}
            options={CHOICE_OPTIONS}
            counts={{ 남매: 9, 자매: 0, 외동: 0, 형제: 0 }}
            trueAnswer="남매"
            myAnswer={undefined}
            voteUpdate={{ votedCount: 2, requiredCount: 4 }}
            onNext={() => logTestClick("객관식 결과 다음으로", { case: "tie" })}
          />
        ),
      },
      {
        id: "round-choice-split",
        label: "Case 1. 질문 주인공 — 정답≠최다득표",
        description: "질문 대상이라 답변 안 함, 정답과 최다 득표가 다른 옵션",
        Component: () => (
          <ChoiceResultPage
            roomName={ROOM_NAME}
            targetName="김태현"
            question={CHOICE_QUESTION}
            options={CHOICE_OPTIONS}
            counts={{ 남매: 3, 자매: 4, 외동: 2, 형제: 0 }}
            trueAnswer="남매"
            myAnswer={undefined}
            voteUpdate={{ votedCount: 2, requiredCount: 4 }}
            onNext={() => logTestClick("객관식 결과 다음으로", { case: "split" })}
          />
        ),
      },
      {
        id: "round-choice-correct",
        label: "Case 2. 나머지 — 정답",
        description: "내가 답변자, 정답을 맞춘 경우",
        Component: () => (
          <ChoiceResultPage
            roomName={ROOM_NAME}
            targetName="김태현"
            question={CHOICE_QUESTION}
            options={CHOICE_OPTIONS}
            counts={{ 남매: 3, 자매: 0, 외동: 0, 형제: 0 }}
            trueAnswer="남매"
            myAnswer="남매"
            voteUpdate={{ votedCount: 2, requiredCount: 4 }}
            onNext={() => logTestClick("객관식 결과 다음으로", { case: "correct" })}
          />
        ),
      },
      {
        id: "round-choice-incorrect",
        label: "Case 2. 나머지 — 오답",
        description: "내가 답변자, 정답을 틀린 경우",
        Component: () => (
          <ChoiceResultPage
            roomName={ROOM_NAME}
            targetName="김태현"
            question={CHOICE_QUESTION}
            options={CHOICE_OPTIONS}
            counts={{ 남매: 3, 자매: 2, 외동: 0, 형제: 0 }}
            trueAnswer="남매"
            myAnswer="자매"
            voteUpdate={{ votedCount: 2, requiredCount: 4 }}
            onNext={() => logTestClick("객관식 결과 다음으로", { case: "incorrect" })}
          />
        ),
      },
    ],
  },
  {
    title: "라운드 중간 결과 · 공통",
    cases: [
      {
        id: "round-vote",
        label: "투표 결과",
        description: `"다음으로" 클릭 → 대기 중 상태로 바뀌는지 확인`,
        Component: () => (
          <VoteResultPage
            roomName={ROOM_NAME}
            question={VOTE_QUESTION}
            ranking={MOCK_PARTICIPANTS.map((p, idx) => ({
              participantId: p.participantId,
              name: p.name,
              votes: Math.max(0, 4 - idx),
            }))}
            voteUpdate={{ votedCount: 2, requiredCount: 4 }}
            onNext={() => logTestClick("공통 결과 다음으로")}
          />
        ),
      },
    ],
  },
  {
    title: "최종 결과지",
    cases: [
      {
        id: "report-answer",
        label: "주관식 결과지",
        Component: () => (
          <div className="bg-black px-5 py-8">
            <ReportCardView roomName={ROOM_NAME} date="2025.08.09" card={ANSWER_REPORT_CARD} />
          </div>
        ),
      },
      {
        id: "report-choice",
        label: "객관식 결과지",
        Component: () => (
          <div className="bg-black px-5 py-8">
            <ReportCardView roomName={ROOM_NAME} date="2025.08.09" card={CHOICE_REPORT_CARD} />
          </div>
        ),
      },
    ],
  },
];

export const TEST_CASE_MAP = TEST_CASE_GROUPS.flatMap((group) => group.cases).reduce(
  (map, testCase) => {
    map[testCase.id] = testCase;
    return map;
  },
  {},
);
