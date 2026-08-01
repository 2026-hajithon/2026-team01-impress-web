import onboardingIcon from "@assets/Onboarding/OnboardingTitle2.svg";
import subjectiveIcon from "@assets/Onboarding/Onboarding2-Icon1.svg";
import objectiveIcon from "@assets/Onboarding/Onboarding2-Icon2.svg";

import OnboardingLayout from "./OnboardingLayout";

const Onboarding2Page = () => {
  return (
    <OnboardingLayout icon={onboardingIcon} iconAlt="알람 시계 아이콘">
      <h1 className="mt-5 text-head1-2">
        주어진 시간 안에
        <br />
        질문에 답해주세요
      </h1>

      <div className="mt-7.5 flex w-full flex-col gap-3 rounded-2xl bg-gray-950 p-10">
        <div className="flex items-center text-head2-2">
          <span>주관식</span>
          <span className="ml-auto flex items-center gap-2 text-main-pink">
            <img className="size-7.5" src={subjectiveIcon} alt="" />
            60
          </span>
        </div>
        <div className="flex items-center text-head2-2">
          <span>객관식</span>
          <span className="ml-auto flex items-center gap-2 text-main-blue">
            <img className="size-7.5" src={objectiveIcon} alt="" />
            15
          </span>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding2Page;
