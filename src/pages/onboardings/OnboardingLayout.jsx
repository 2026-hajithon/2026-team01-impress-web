import GameBackground from "@components/games/GameBackground";

import LoadingSpinner from "./LoadingSpinner";

const OnboardingLayout = ({ icon, iconAlt, children }) => {
  return (
    <main className="relative mx-auto flex h-dvh min-h-170 w-full max-w-107.5 flex-col items-center overflow-hidden px-8 pt-15 text-center text-white">
      <GameBackground />
      <img className="shrink-0" src={icon} alt={iconAlt} />
      {children}
      <LoadingSpinner />
    </main>
  );
};

export default OnboardingLayout;
