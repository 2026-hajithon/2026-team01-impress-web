import Button from "@components/Button";
import GameBackground from "@components/games/GameBackground";
import homeLogo from "@assets/Home/HomeLogo.svg";
import homeTitle from "@assets/Home/HomeTitle.svg";

import { useNavigate } from "react-router-dom";
import { navigateWithTransition } from "@utils/navigateWithTransition";

const StartPage = () => {
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        navigateWithTransition(navigate, "/enter-leader-name");
    };

    const handleJoinRoom = () => {
        navigateWithTransition(navigate, "/enter-room-code");
    };
  return (
    <main className="min-h-dvh bg-white">
      <section
        className={[
          "relative isolate mx-auto flex min-h-dvh w-full max-w-[430px]",
          "flex-col overflow-hidden bg-black",
        ].join(" ")}
      >
        <GameBackground />

        {/* 메인 로고 및 그래픽 영역 */}
        <div
          className={[
            "relative z-10 flex flex-1 flex-col items-center",
            "justify-start gap-3",
            "pt-[clamp(4rem,13dvh,7rem)]",
          ].join(" ")}
        >
          <img
            src={homeLogo}
            alt=""
            aria-hidden="true"
            className="h-auto w-1/2 max-w-[195px] translate-x-[6px]"
          />

          <img
            src={homeTitle}
            alt="I'm Press"
            className="h-auto w-[62%] max-w-[243px] translate-x-[6px]"
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="relative z-10 flex flex-col gap-2 pt-2 px-5 pb-8">
          <Button
            variant="primary"
            onClick={handleCreateRoom}
          >
            모임 생성하기
          </Button>

          <Button
            variant="secondary"
            onClick={handleJoinRoom}
          >
            모임 참여하기
          </Button>
        </div>
      </section>
    </main>
  )
}

export default StartPage
