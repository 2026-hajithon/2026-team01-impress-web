function Header({
  title,
  timer,
  timerIcon,
  rightSlot,
  className = "",
}) {
  return (
    <header
      className={[
        "flex w-full items-center justify-between",
        "bg-transparent px-5 py-5",
        className,
      ].join(" ")}
    >
      <h1 className="text-sub1-1 text-gray-200">
        {title}
      </h1>

      {rightSlot ??
        (timer !== undefined && (
          <div className="flex shrink-0 items-center gap-1.5">
            {timerIcon && (
              <span className="flex size-6 items-center justify-center">
                {timerIcon}
              </span>
            )}

            <span className="text-head3-2 text-main-blue">
              {timer}
            </span>
          </div>
        ))}
    </header>
  );
}

export default Header;