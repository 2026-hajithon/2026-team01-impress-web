const LoadingSpinner = () => {
  return (
    <svg
      className="absolute bottom-6 left-1/2 size-8 -translate-x-1/2 animate-spin"
      viewBox="0 0 32 32"
      fill="none"
      aria-label="로딩 중"
      role="status"
    >
      <defs>
        <linearGradient
          id="onboarding-spinner"
          x1="4"
          y1="28"
          x2="28"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF3B9B" />
          <stop offset="0.35" stopColor="#C45FE1" />
          <stop offset="0.72" stopColor="#6991FF" />
          <stop offset="1" stopColor="#8DACFF" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="url(#onboarding-spinner)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="50 20"
      />
    </svg>
  );
};

export default LoadingSpinner;
