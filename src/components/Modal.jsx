import { useId } from "react";
import { createPortal } from "react-dom";

import closeIcon from "@assets/utils/Close.svg";
import Button from "@components/Button";

const Modal = ({
  isOpen,
  onClose,
  graphic,
  title,
  description,
  actionLabel,
  onAction,
  actionVariant = "primary",
  closeOnBackdrop = false,
  showCloseButton = true,
  className = "",
}) => {
  const titleId = useId();

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={[
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-black/[0.59] px-5 py-8",
      ].join(" ")}
      onClick={handleBackdropClick}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          "w-full max-w-[320px] overflow-hidden",
          "rounded-[25px] bg-white",
          className,
        ].join(" ")}
        onClick={(event) => event.stopPropagation()}
      >
        {showCloseButton && (
          <div className="flex w-full justify-end p-2.5">
            <button
              type="button"
              onClick={onClose}
              aria-label="모달 닫기"
              className="size-8 shrink-0"
            >
              <img
                src={closeIcon}
                alt=""
                className="size-full"
              />
            </button>
          </div>
        )}

        <div className="flex w-full flex-col items-center gap-[23px] pb-[30px]">
          {graphic && (
            <div className="flex w-full justify-center">
              {graphic}
            </div>
          )}

          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h2
              id={titleId}
              className="text-head2-1 text-black"
            >
              {title}
            </h2>

            {description && (
              <p className="w-full max-w-[274px] text-body1-2 text-gray-500">
                {description}
              </p>
            )}
          </div>

          {actionLabel && (
            <div className="w-[calc(100%-2.5rem)] max-w-[258px]">
              <Button
                variant={actionVariant}
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default Modal;