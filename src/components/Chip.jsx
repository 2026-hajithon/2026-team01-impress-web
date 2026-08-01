function Chip({
  prefix,
  children,
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex w-fit self-start min-h-6 items-center gap-1",
        "rounded-xl bg-gray-950 px-2 py-1",
        "text-caption1-2",
        className,
      ].join(" ")}
    >
      {prefix && (
        <strong className="text-body1-1 text-main-pink">
          {prefix}
        </strong>
      )}

      <span className="text-body1-2 text-gray-300">
        {children}
      </span>
    </span>
  );
}

export default Chip;