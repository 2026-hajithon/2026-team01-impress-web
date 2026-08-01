import { useEffect, useState } from "react";

export const MODAL_EXIT_DURATION = 220;

export const useModalPresence = (isOpen) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let exitTimer;

    const animationFrame = window.requestAnimationFrame(() => {
      if (isOpen) {
        setShouldRender(true);
        setIsClosing(false);
        return;
      }

      if (!shouldRender) return;

      setIsClosing(true);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      exitTimer = window.setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, reducedMotion ? 0 : MODAL_EXIT_DURATION);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(exitTimer);
    };
  }, [isOpen, shouldRender]);

  return { shouldRender, isClosing };
};
