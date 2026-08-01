import { Link } from "react-router-dom";
import PersonalAnswerGamePage from "./games/PersonalAnswerGamePage";
import PersonalChoiceGamePage from "./games/PersonalChoiceGamePage";
import GeneralChoiceGamePage from "./games/GeneralChoiceGamePage";
import AnswerResultPage from "./games/AnswerResultPage";
import ChoiceResultPage from "./games/ChoiceResultPage";
import VoteResultPage from "./games/VoteResultPage";
import ReportCardView from "./games/ReportCardView";
import { buildReportCards } from "./games/reportCards";
import { MOCK_FINAL_RESULT } from "@apis/mockData";

// 게임 종료 -> 결과지 화면은 실제 방(roomCode)이 있어야 라우팅되는 GameResultPage를 그대로 쓰는 게
// 목 데이터 폴백까지 실제와 똑같이 확인할 수 있어서, 전체 플로우는 이 라우트로 보낸다.
const TEST_ROOM_CODE = "TEST-ROOM";

// 결과지 2종(주관식/객관식)을 캐러셀 없이 한 번에 훑어볼 수 있도록 목 데이터로 미리 만들어둔다.
const REPORT_CARDS = buildReportCards(MOCK_FINAL_RESULT);

const MOCK_PARTICIPANTS = [
  { participantId: 1, name: "김태현" },
  { participantId: 2, name: "김가빈" },
  { participantId: 3, name: "김수현" },
  { participantId: 4, name: "이혁" },
  { participantId: 5, name: "윤소연" },
  { participantId: 6, name: "유영주" },
];

const TestPage = () => {
  sessionStorage.setItem("participantId", "1");
  sessionStorage.setItem("roomName", "테스트 모임방");

  return (
    <div className="flex flex-col gap-5 bg-black w-full">
      <div className="flex flex-col gap-3 p-5">
        <p className="text-body1-1 text-white">게임 종료 → 결과지 테스트</p>
        <p className="text-body2-2 text-gray-400">
          백엔드에 존재하지 않는 방 코드({TEST_ROOM_CODE})라 결과지 API 요청은 실패하고,
          자동으로 목 데이터로 대체돼요.
        </p>
        <Link
          to={`/rooms/${TEST_ROOM_CODE}/result`}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-main-gradient text-body1-2 text-white"
        >
          게임 종료 화면부터 보기
        </Link>
      </div>

      <div className="flex flex-col gap-8 px-5 pb-5">
        <p className="text-body1-1 text-white">결과지 미리보기 (주관식 · 객관식 둘 다)</p>
        {REPORT_CARDS.map((card) => (
          <div key={card.roundId} className="flex flex-col gap-2">
            <p className="text-caption1-2 text-gray-400">
              {card.qType === "BLANK" ? "① 주관식 결과지" : "② 객관식 결과지"}
            </p>
            <ReportCardView roomName="테스트 모임방" date="2025.08.09" card={card} />
          </div>
        ))}
      </div>

      <PersonalAnswerGamePage
        roomName="하지톤 1팀"
        timeLeft={60}
        targetName="김태현"
        question="이 사람은 주말에 ____를 할 것 같은 인상이다!"
        submitted={false}
        onSubmit={() => {}}
      />
      <PersonalChoiceGamePage
        roomName="하지톤 1팀"
        timeLeft={60}
        targetName="김태현"
        question={`이 사람의 형제관계는\n어떻게 될까?`}
        options={["남매", "자매", "외동", "형제"]}
        submitted={false}
        onSubmit={() => {}}
      />
      <GeneralChoiceGamePage
        roomName="하지톤 1팀"
        timeLeft={60}
        question={`어렸을 때, 가장 엄마 말을 안들었을 것 같은 사람은?`}
        participants={MOCK_PARTICIPANTS}
        submitted={false}
        onSubmit={() => {}}
      />

      <AnswerResultPage
        roomName="하지톤 1팀"
        targetName="김태현"
        question="이 사람은 주말에 ____를 할 것 같은 인상이다!"
        answers={[
          { submitterId: 1, submitterName: "김태현", textAnswer: "카페에서 커피마시면서 조용히 공부" },
          { submitterId: 2, submitterName: "김가빈", textAnswer: "계획 없이 차타고 놀러가기" },
          { submitterId: 3, submitterName: "이혁", textAnswer: "집에서 좋아하는 영화를 보면서 맛있는 음식을 시켜 먹을" },
        ]}
        voteUpdate={null}
        onNext={() => {}}
      />
      <ChoiceResultPage
        roomName="하지톤 1팀"
        targetName="김태현"
        question={`이 사람의 형제 관계는\n어떻게 될까?`}
        options={["남매", "자매", "외동", "형제"]}
        counts={{ 남매: 3, 자매: 0, 외동: 0, 형제: 0 }}
        trueAnswer="남매"
        myAnswer="남매"
        voteUpdate={null}
        onNext={() => {}}
      />
      <VoteResultPage
        roomName="하지톤 1팀"
        question={`어렸을 때, 가장 엄마 말을\n안들었을 것 같은 사람은?`}
        ranking={MOCK_PARTICIPANTS.map((p, idx) => ({
          participantId: p.participantId,
          name: p.name,
          votes: Math.max(0, 4 - idx),
        }))}
        voteUpdate={null}
        onNext={() => {}}
      />
    </div>
  );
};

export default TestPage;
