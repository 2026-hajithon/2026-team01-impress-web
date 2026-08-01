import { useNavigate } from "react-router-dom";
import Button from "@components/Button";
import GameBackground from "@components/games/GameBackground";
import { useFrontendTest } from "../FrontendTestContext";

const FrontendTestWaitingPage = () => {
  const navigate = useNavigate();
  const { session, resetSession } = useFrontendTest();

  const handleLeave = () => {
    resetSession();
    navigate("/", { replace: true });
  };

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[500px] flex-col overflow-hidden bg-black">
      <GameBackground />
      <header className="relative px-5 pb-5 pt-12 text-center">
        <h1 className="text-head2-2 text-white">{session.roomName}</h1>
        <p className="mt-1 text-caption1-2 text-gray-500">입장 코드 {session.roomCode}</p>
      </header>
      <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <p className="mb-3 text-body1-1 text-white">참가자 {session.participants.length}명</p>
        <ul className="flex flex-col gap-2">
          {session.participants.map((participant) => (
            <li key={participant.participantId} className="flex items-center justify-between rounded-2xl bg-gray-950 px-4 py-4">
              <span className="text-body1-1 text-white">{participant.name}</span>
              {participant.role === "HOST" && (
                <span className="rounded-full bg-main-pink/15 px-2.5 py-1 text-caption1-1 text-main-pink-1">방장</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <footer className="relative flex gap-2 px-5 pb-8 pt-3">
        <div className="w-2/5"><Button variant="secondary" onClick={handleLeave}>나가기</Button></div>
        <Button onClick={() => navigate("/countdown")}>게임 시작하기</Button>
      </footer>
    </main>
  );
};

export default FrontendTestWaitingPage;
