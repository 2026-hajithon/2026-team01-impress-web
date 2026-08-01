import onboardingPhone from "@assets/Onboarding/OnboardingPhone5.png";
import onboardingIcon from "@assets/Onboarding/OnboardingTitle5.svg";
import Chip from "@components/Chip";

import OnboardingLayout from "./OnboardingLayout";
import OnboardingMockup from "./OnboardingMockup";

const Onboarding5Page = () => {
  return (
    <OnboardingLayout icon={onboardingIcon} iconAlt="투표함 아이콘">
      <Chip className="mt-7" size="large" prefix="공통">
        질문
      </Chip>
      <h1 className="mt-2 text-head1-2">
        질문에 가장 잘 어울리는 사람
        <br />
        1명을 투표해주세요
      </h1>
      <OnboardingMockup
        src={onboardingPhone}
        alt="공통 질문 투표 화면 예시"
      />
    </OnboardingLayout>
  );
};

export default Onboarding5Page;
