import { useState } from "react";
import { Link } from "react-router-dom";
import PersonalAnswerGamePage from "./games/PersonalAnswerGamePage";
import PersonalChoiceGamePage from "./games/PersonalChoiceGamePage";
import GeneralChoiceGamePage from "./games/GeneralChoiceGamePage";
import AnswerResultPage from "./results/AnswerResultPage";
import ChoiceResultPage from "./results/ChoiceResultPage";
import VoteResultPage from "./results/VoteResultPage";
import ReportCardView from "@components/games/ReportCardView";
import { buildReportCards } from "@utils/reportCards";
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

// 실제 컴포넌트의 onSubmit/onNext가 진짜로 호출되는지 콘솔에서 바로 확인할 수 있도록 남긴다
// (axiosClient의 콘솔 로그 컨벤션과 동일한 스타일).
const logTestClick = (label, payload) => {
  console.log(`%c[TEST 클릭] ${label}`, "color:#8dacff; font-weight:bold", payload);
};

// 제목 + "다시 하기" 버튼(리마운트로 내부 state 초기화) 묶음. key를 바꿔서 컴포넌트를 통째로 리셋한다.
const TestCase = ({ title, description, children }) => {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-5">
        <div className="flex flex-col gap-0.5">
          <p className="text-body1-1 text-white">{title}</p>
          {description && <p className="text-caption1-2 text-gray-400">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => setResetKey((prev) => prev + 1)}
          className="shrink-0 rounded-full bg-gray-950 px-3 py-1.5 text-caption1-1 text-gray-300"
        >
          다시 하기
        </button>
      </div>
      {children(resetKey)}
    </div>
  );
};

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
        <Link
          to="/countdown"
          className="flex h-14 w-full items-center justify-center rounded-xl bg-main-blue text-body1-2 text-white"
        >
          카운트다운 화면 보기
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

      {/*
        방장/멤버 구분 안내: RoomSocket.js·useRoomSocket.js를 보면 myRole(HOST/MEMBER)은
        대기방의 "게임 시작"/"강퇴" 버튼에만 쓰이고, 라운드 진행 화면(아래 3종)에는
        역할 분기가 전혀 없다 — 같은 라운드를 모든 참가자가 동시에 동일한 화면으로 푼다.
        그래서 이 테스트 페이지도 방장/멤버를 따로 나누지 않고 화면당 1개씩만 둔다.
      */}
      <div className="flex flex-col gap-10 pb-5">
        <p className="px-5 text-body1-1 text-white">
          게임 화면 — 직접 눌러서 버튼이 실제로 동작하는지 확인 (제출 시 콘솔에 로그가 남아요)
        </p>

        <TestCase title="① 주관식" description="입력 후 제출하기 → 제출 완료로 잠기는지 확인">
          {(resetKey) => (
            <PersonalAnswerGamePage
              key={resetKey}
              roomName="하지톤 1팀"
              timeLeft={60}
              targetName="김태현"
              question="이 사람은 주말에 ____를 할 것 같은 인상이다!"
              submitted={false}
              onSubmit={(value) => logTestClick("주관식 제출", { value })}
            />
          )}
        </TestCase>

        <TestCase title="② 객관식" description="선택지 클릭 → 핑크로 선택되고 나머지가 잠기는지 확인">
          {(resetKey) => (
            <PersonalChoiceGamePage
              key={resetKey}
              roomName="하지톤 1팀"
              timeLeft={60}
              targetName="김태현"
              question={`이 사람의 형제관계는\n어떻게 될까?`}
              options={["남매", "자매", "외동", "형제"]}
              submitted={false}
              onSubmit={(value) => logTestClick("객관식 선택", { value })}
            />
          )}
        </TestCase>

        <TestCase title="③ 공통" description="참가자 클릭 → 선택되고 나머지가 잠기는지 확인">
          {(resetKey) => (
            <GeneralChoiceGamePage
              key={resetKey}
              roomName="하지톤 1팀"
              timeLeft={60}
              question={`어렸을 때, 가장 엄마 말을 안들었을 것 같은 사람은?`}
              participants={MOCK_PARTICIPANTS}
              submitted={false}
              onSubmit={(value) => logTestClick("공통 선택", { value })}
            />
          )}
        </TestCase>
      </div>

      <div className="flex flex-col gap-10 pb-5">
        <p className="px-5 text-body1-1 text-white">라운드 결과 화면 — "다음으로" 버튼 동작 확인</p>

        <TestCase title="① 주관식 결과">
          {(resetKey) => (
            <AnswerResultPage
              key={resetKey}
              roomName="하지톤 1팀"
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
              ]}
              voteUpdate={null}
              onNext={() => logTestClick("주관식 결과 다음으로")}
            />
          )}
        </TestCase>

        <TestCase title="② 객관식 결과">
          {(resetKey) => (
            <ChoiceResultPage
              key={resetKey}
              roomName="하지톤 1팀"
              targetName="김태현"
              question={`이 사람의 형제 관계는\n어떻게 될까?`}
              options={["남매", "자매", "외동", "형제"]}
              counts={{ 남매: 3, 자매: 0, 외동: 0, 형제: 0 }}
              trueAnswer="남매"
              myAnswer="남매"
              voteUpdate={null}
              onNext={() => logTestClick("객관식 결과 다음으로")}
            />
          )}
        </TestCase>

        <TestCase title="③ 공통 결과">
          {(resetKey) => (
            <VoteResultPage
              key={resetKey}
              roomName="하지톤 1팀"
              question={`어렸을 때, 가장 엄마 말을\n안들었을 것 같은 사람은?`}
              ranking={MOCK_PARTICIPANTS.map((p, idx) => ({
                participantId: p.participantId,
                name: p.name,
                votes: Math.max(0, 4 - idx),
              }))}
              voteUpdate={null}
              onNext={() => logTestClick("공통 결과 다음으로")}
            />
          )}
        </TestCase>
      </div>
    </div>
  );
};

export default TestPage;
