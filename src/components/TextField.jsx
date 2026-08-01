import { useId } from "react";

function TextField({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  message,
  hasError = false,
  disabled = false,
  className = "",
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className={`w-full ${className}`}>
      <input
        {...props}
        id={inputId}
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={message ? messageId : undefined}
        className={[
          "h-13.5 w-full rounded-lg border px-4",
          "bg-gray-950 text-body1-2 text-white",
          "placeholder:text-gray-600",
          "outline-none transition-colors",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError ? "border-main-pink" : "border-transparent",
        ].join(" ")}
      />

      <p
        id={messageId}
        aria-live="polite"
        className="px-1 mt-2.5 min-h-4 text-caption1-2 text-main-pink"
      >
        {message}
      </p>
    </div>
  );
}

export default TextField;