import { Link } from "react-router-dom";
import { TEST_CASE_GROUPS } from "./testCaseRegistry";

// 게임 종료 -> 결과지 화면은 실제 방(roomCode)이 있어야 라우팅되는 GameResultPage를 그대로 쓰는 게
// 목 데이터 폴백까지 실제와 똑같이 확인할 수 있어서, 전체 플로우는 이 라우트로 보낸다.
const TEST_ROOM_CODE = "TEST-ROOM";

const TestPage = () => {
  sessionStorage.setItem("participantId", "1");
  sessionStorage.setItem("roomCode", TEST_ROOM_CODE);
  sessionStorage.setItem("roomName", "테스트 모임방");

  return (
    <div className="flex min-h-dvh flex-col gap-8 bg-black p-5">
      <div className="flex flex-col gap-1">
        <p className="text-head3-1 text-white">테스트 메뉴</p>
        <p className="text-body2-2 text-gray-400">
          버튼을 눌러 케이스별 화면으로 들어가서 직접 확인해보세요.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-body1-1 text-white">게임 종료 이후 전체 흐름</p>
        <p className="text-caption1-2 text-gray-500">
          결과지 보기 → 이미지 저장 → 대기 화면 복귀 버튼까지 확인할 수 있어요.
        </p>
        <Link
          to={`/rooms/${TEST_ROOM_CODE}/result`}
          className="flex h-14 items-center justify-center rounded-xl bg-main-gradient text-body1-2 text-white"
        >
          게임 종료 → 최종 결과지 전체 테스트
        </Link>
        <Link
          to="/countdown"
          className="flex h-14 items-center justify-center rounded-xl bg-main-blue text-body1-2 text-white"
        >
          카운트다운
        </Link>
      </div>

      {TEST_CASE_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <p className="text-body1-1 text-white">{group.title}</p>
          <div className="flex flex-col gap-2">
            {group.cases.map((testCase) => (
              <Link
                key={testCase.id}
                to={`/test/case/${testCase.id}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-gray-950 px-4 py-3"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-body2-1 text-white">{testCase.label}</span>
                  {testCase.description && (
                    <span className="text-caption1-2 text-gray-500">{testCase.description}</span>
                  )}
                </span>
                <span className="shrink-0 text-gray-500">›</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestPage;
