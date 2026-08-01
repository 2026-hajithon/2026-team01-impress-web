import onboardingPhone from "@assets/Onboarding/OnboardingPhone3.png";
import onboardingIcon from "@assets/Onboarding/OnboardingTitle3.svg";
import Chip from "@components/Chip";

import OnboardingLayout from "./OnboardingLayout";
import OnboardingMockup from "./OnboardingMockup";

const Onboarding3Page = () => {
  return (
    <OnboardingLayout icon={onboardingIcon} iconAlt="연필 아이콘">
      <Chip className="mt-7" size="large" prefix="개인">
        질문 - 빈칸 채우기
      </Chip>
      <h1 className="mt-2 text-head1-2">
        질문 주인공이 어떤 이미지일지
        <br />
        상상하며 빈칸을 채워주세요
      </h1>
      <OnboardingMockup
        src={onboardingPhone}
        alt="개인 질문 빈칸 채우기 화면 예시"
      />
    </OnboardingLayout>
  );
};

export default Onboarding3Page;
