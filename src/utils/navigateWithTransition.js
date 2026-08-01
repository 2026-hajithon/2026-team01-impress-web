import { flushSync } from "react-dom";

export const runWithTransition = (update, direction = "forward") => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reducedMotion) {
    update();
    return;
  }

  document.documentElement.dataset.flowTransition = direction;

  const transition = document.startViewTransition(() => {
    flushSync(update);
  });

  void transition.finished
    .finally(() => {
      delete document.documentElement.dataset.flowTransition;
    })
    .catch(() => {});
};

export const navigateWithTransition = (
  navigate,
  destination,
  options,
  direction = "forward",
) => {
  runWithTransition(() => navigate(destination, options), direction);
};
