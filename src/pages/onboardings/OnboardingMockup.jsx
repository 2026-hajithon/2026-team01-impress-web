const OnboardingMockup = ({ src, alt }) => {
  return (
    <div className="relative mt-15 w-77.5 shrink-0">
      <img className="block w-full max-w-none" src={src} alt={alt} />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-b from-transparent via-black/45 to-black"
        aria-hidden="true"
      />
    </div>
  );
};

export default OnboardingMockup;
