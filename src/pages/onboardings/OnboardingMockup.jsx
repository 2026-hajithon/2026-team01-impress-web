const OnboardingMockup = ({ src, alt }) => {
  return (
    <div className="mt-15 w-77.5 shrink-0">
      <img
        className="block w-full max-w-none"
        src={src}
        alt={alt}
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default OnboardingMockup;
