const buttonVariants = {
  primary: "bg-main-gradient",
  secondary: "bg-main-blue",
  pink: "bg-main-pink",
  neutral: "bg-gray-950",
};

function Button({
  children,
  variant = "primary",
  type = "button",
  fullWidth = true,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        "flex h-14 items-center justify-center rounded-xl px-5",
        "text-body1-2 text-white",
        "transition-transform duration-100",
        "active:scale-[0.99]",
        "focus-visible:outline-main-blue",
        "disabled:cursor-not-allowed",
        "disabled:bg-gray-950",
        fullWidth ? "w-full" : "",
        buttonVariants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default Button;