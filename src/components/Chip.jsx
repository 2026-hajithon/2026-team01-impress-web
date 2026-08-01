function Chip({ size, prefix, children, className = "" }) {
  return (
    <span
      className={[
        "inline-flex w-fit min-h-6 items-center gap-1",
        "rounded-[10px] bg-gray-950 px-2.5 py-1.25",
        className,
      ].join(" ")}
    >
      {size == "large" ? (
        <>
          <strong className="text-body1-1 text-main-pink-1">{prefix}</strong>
          <span className="text-body1-2 text-gray-300">{children}</span>
        </>
      ) : (
        <>
          <strong className="text-caption1-1 text-main-pink-1">{prefix}</strong>
          <span className="text-caption1-2 text-gray-300">{children}</span>
        </>
      )}
    </span>
  );
}

export default Chip;
