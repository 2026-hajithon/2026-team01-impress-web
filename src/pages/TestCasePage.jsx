import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TEST_CASE_MAP } from "./testCaseRegistry";

// 케이스 하나를 실제 화면 그대로 보여준다. 상단 바만 테스트 전용 chrome이고,
// 그 아래는 실제 앱에서 쓰는 컴포넌트가 그대로 렌더링된다.
const TestCasePage = () => {
  const { caseId } = useParams();
  const [resetNonce, setResetNonce] = useState(0);
  const testCase = TEST_CASE_MAP[caseId];

  if (!testCase) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black p-5">
        <p className="text-body1-1 text-white">존재하지 않는 테스트 케이스예요: {caseId}</p>
        <Link to="/test" className="text-body2-2 text-main-blue-1 underline">
          테스트 메뉴로
        </Link>
      </div>
    );
  }

  const { Component } = testCase;

  return (
    <div className="flex h-dvh flex-col bg-black">
      <div className="flex shrink-0 items-center justify-between gap-2 bg-gray-950 px-4 py-2">
        <Link to="/test" className="shrink-0 text-caption1-2 text-gray-300">
          ← 메뉴로
        </Link>
        <p className="truncate text-caption1-2 text-gray-500">{testCase.label}</p>
        <button
          type="button"
          onClick={() => setResetNonce((prev) => prev + 1)}
          className="shrink-0 text-caption1-2 text-main-blue-1"
        >
          다시 시작
        </button>
      </div>
      {/* 케이스 컴포넌트는 내부적으로 min-h-dvh를 쓰므로, 위 바 높이만큼 전체 페이지가
          늘어나지 않도록 남은 공간 안에서만 스크롤되게 감싼다. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Component key={resetNonce} />
      </div>
    </div>
  );
};

export default TestCasePage;
