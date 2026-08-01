import { flushSync } from "react-dom";

export const navigateWithTransition = (
  navigate,
  destination,
  options,
  direction = "forward",
) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reducedMotion) {
    navigate(destination, options);
    return;
  }

  document.documentElement.dataset.flowTransition = direction;

  const transition = document.startViewTransition(() => {
    flushSync(() => navigate(destination, options));
  });

  void transition.finished
    .finally(() => {
      delete document.documentElement.dataset.flowTransition;
    })
    .catch(() => {});
};
