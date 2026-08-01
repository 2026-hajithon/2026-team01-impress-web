import { useEffect, useState } from "react";
import GameBackground from "@components/games/GameBackground";

import Onboarding1Page from "./Onboarding1Page";
import Onboarding2Page from "./Onboarding2Page";
import Onboarding3Page from "./Onboarding3Page";
import Onboarding4Page from "./Onboarding4Page";
import Onboarding5Page from "./Onboarding5Page";
import Onboarding6Page from "./Onboarding6Page";
import "./OnboardingPage.css";

const SLIDE_DURATION = 3000;
const FADE_DURATION = 700;

const ONBOARDING_SLIDES = [
  Onboarding1Page,
  Onboarding2Page,
  Onboarding3Page,
  Onboarding4Page,
  Onboarding5Page,
  Onboarding6Page,
];

const shuffleSlides = () => {
  const slides = [...ONBOARDING_SLIDES];

  for (let index = slides.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [slides[index], slides[randomIndex]] = [slides[randomIndex], slides[index]];
  }

  return slides;
};

// 로딩이 필요한 화면에서는 이 페이지를 렌더링하고, 로딩이 끝나면 호출부에서
// 다음 화면으로 교체한다. 마운트되어 있는 동안 온보딩이 3초마다 무작위 순서로 바뀐다.
const OnboardingPage = () => {
  const [{ slides, currentIndex, revision }, setSequence] = useState(() => ({
    slides: shuffleSlides(),
    currentIndex: 0,
    revision: 0,
  }));
  const [outgoingSlide, setOutgoingSlide] = useState(null);

  useEffect(() => {
    const changeSlideTimeoutId = window.setTimeout(() => {
      const PreviousSlide = slides[currentIndex];
      setOutgoingSlide(<PreviousSlide />);

      setSequence((previousSequence) => {
        const nextIndex = previousSequence.currentIndex + 1;

        if (nextIndex < previousSequence.slides.length) {
          return {
            ...previousSequence,
            currentIndex: nextIndex,
            revision: previousSequence.revision + 1,
          };
        }

        return {
          slides: shuffleSlides(),
          currentIndex: 0,
          revision: previousSequence.revision + 1,
        };
      });
    }, SLIDE_DURATION);

    return () => window.clearTimeout(changeSlideTimeoutId);
  }, [currentIndex, slides]);

  useEffect(() => {
    if (!outgoingSlide) return undefined;

    const removeOutgoingTimeoutId = window.setTimeout(() => {
      setOutgoingSlide(null);
    }, FADE_DURATION);

    return () => window.clearTimeout(removeOutgoingTimeoutId);
  }, [outgoingSlide]);

  const CurrentSlide = slides[currentIndex];

  return (
    <div className="relative isolate mx-auto h-dvh w-full max-w-107.5 overflow-hidden bg-black">
      <GameBackground />

      {outgoingSlide && (
        <div className="onboarding-slide-exit pointer-events-none absolute inset-0 z-10">
          {outgoingSlide}
        </div>
      )}

      <div key={revision} className="onboarding-slide-enter absolute inset-0 z-20">
        <CurrentSlide />
      </div>
    </div>
  );
};

export default OnboardingPage;
