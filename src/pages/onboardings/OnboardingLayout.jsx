import LoadingSpinner from "./LoadingSpinner";

const OnboardingLayout = ({ icon, iconAlt, children }) => {
  return (
    <main className="relative mx-auto flex h-dvh min-h-170 w-full max-w-107.5 flex-col items-center overflow-hidden px-8 pt-15 text-center text-white">
      <img className="shrink-0" src={icon} alt={iconAlt} />
      {children}
      <p className="absolute bottom-[72px] left-1/2 z-10 w-full -translate-x-1/2 text-body2-2 text-gray-400">
        다음 페이지로 넘어갈 준비 중이에요
      </p>
      <LoadingSpinner />
    </main>
  );
};

export default OnboardingLayout;
