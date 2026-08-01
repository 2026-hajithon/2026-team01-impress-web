import onboardingIcon from "@assets/Onboarding/OnboardingTitle1.svg";
import personalQuestionIcon from "@assets/Onboarding/Onboarding1-Icon1.svg";
import generalQuestionIcon from "@assets/Onboarding/Onboarding1-Icon2.svg";

import OnboardingLayout from "./OnboardingLayout";

const Onboarding1Page = () => {
  return (
    <OnboardingLayout icon={onboardingIcon} iconAlt="질문 게임 아이콘">
      <h1 className="mt-5 text-head1-2">
        게임은 개인질문과
        <br />
        공통질문 1개로 구성돼요
      </h1>

      <div className="mt-7.5 flex w-full flex-col gap-3 rounded-2xl bg-gray-950 p-10">
        <div className="flex items-center text-head2-2">
          <span>개인질문</span>
          <span className="ml-auto flex items-center gap-2 text-main-pink">
            <img className="size-7.5" src={personalQuestionIcon} alt="" />
            랜덤
          </span>
        </div>
        <div className="flex items-center text-head2-2">
          <span>공통질문</span>
          <span className="ml-auto flex items-center gap-2 text-main-blue">
            <img className="size-7.5" src={generalQuestionIcon} alt="" />
            랭킹
          </span>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding1Page;
