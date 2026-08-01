import onboardingPhone from "@assets/Onboarding/OnboardingPhone4.png";
import onboardingIcon from "@assets/Onboarding/OnboardingTitle4.svg";
import Chip from "@components/Chip";

import OnboardingLayout from "./OnboardingLayout";
import OnboardingMockup from "./OnboardingMockup";

const Onboarding4Page = () => {
  return (
    <OnboardingLayout icon={onboardingIcon} iconAlt="체크 아이콘">
      <Chip className="mt-7" size="large" prefix="개인">
        질문 - 보기 고르기
      </Chip>
      <h1 className="mt-2 text-head1-2">
        질문 주인공의 이미지에
        <br />
        어울리는 보기를 눌러주세요
      </h1>
      <OnboardingMockup
        src={onboardingPhone}
        alt="개인 질문 보기 고르기 화면 예시"
      />
    </OnboardingLayout>
  );
};

export default Onboarding4Page;
