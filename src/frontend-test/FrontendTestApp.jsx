import { memo, useMemo, useRef, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import FrontendTestSetupPage from "./pages/FrontendTestSetupPage";
import FrontendTestWaitingPage from "./pages/FrontendTestWaitingPage";
import FrontendTestCountdownPage from "./pages/FrontendTestCountdownPage";
import FrontendTestLoadingPage from "./pages/FrontendTestLoadingPage";
import FrontendTestGamePage from "./pages/FrontendTestGamePage";
import FrontendTestEndPage from "./pages/FrontendTestEndPage";
import FrontendTestReportPage from "./pages/FrontendTestReportPage";
import { createTestSession } from "./testSession";
import { FrontendTestContext, useFrontendTest } from "./FrontendTestContext";

const SessionRoute = ({ children }) => {
  const { session } = useFrontendTest();
  return session ? children : <Navigate to="/" replace />;
};

const STORAGE_KEY = "impress-frontend-test-session";

const readStoredState = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

const storeState = (state) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const FrontendTestRouter = memo(() => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<FrontendTestSetupPage />} />
      <Route path="/waiting" element={<SessionRoute><FrontendTestWaitingPage /></SessionRoute>} />
      <Route path="/countdown" element={<SessionRoute><FrontendTestCountdownPage /></SessionRoute>} />
      <Route path="/loading" element={<SessionRoute><FrontendTestLoadingPage /></SessionRoute>} />
      <Route path="/game" element={<SessionRoute><FrontendTestGamePage /></SessionRoute>} />
      <Route path="/end" element={<SessionRoute><FrontendTestEndPage /></SessionRoute>} />
      <Route path="/report" element={<SessionRoute><FrontendTestReportPage /></SessionRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </HashRouter>
));

FrontendTestRouter.displayName = "FrontendTestRouter";

const FrontendTestApp = () => {
  const [initialState] = useState(readStoredState);
  const [session, setSession] = useState(initialState.session ?? null);
  const [roundIndex, setRoundIndex] = useState(initialState.roundIndex ?? 0);
  const answersRef = useRef(initialState.answers ?? {});

  const value = useMemo(
    () => ({
      session,
      roundIndex,
      getAnswers: () => answersRef.current,
      startSession: (config) => {
        const nextSession = createTestSession(config);
        storeState({ session: nextSession, roundIndex: 0, answers: {} });
        answersRef.current = {};
        setSession(nextSession);
        setRoundIndex(0);
      },
      saveAnswer: (roundId, answer) => {
        answersRef.current[roundId] = answer;
        storeState({ session, roundIndex, answers: answersRef.current });
      },
      moveToNextRound: () =>
        setRoundIndex((previous) => {
          const nextRoundIndex = previous + 1;
          storeState({ session, roundIndex: nextRoundIndex, answers: answersRef.current });
          return nextRoundIndex;
        }),
      resetSession: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        answersRef.current = {};
        setSession(null);
        setRoundIndex(0);
      },
    }),
    [roundIndex, session],
  );

  return (
    <div className="min-h-dvh bg-gray-950">
      <div
        className="relative mx-auto min-h-dvh w-full max-w-[500px] overflow-x-hidden bg-black shadow-[0_0_36px_rgba(15,17,22,0.16)]"
        data-testid="frontend-test-shell"
      >
        <FrontendTestContext.Provider value={value}>
          <FrontendTestRouter />
        </FrontendTestContext.Provider>
      </div>
    </div>
  );
};

export default FrontendTestApp;
