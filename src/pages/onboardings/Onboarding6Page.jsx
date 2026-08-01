import onboardingPhone from "@assets/Onboarding/OnboardingPhone6.png";
import onboardingIcon from "@assets/Onboarding/OnboardingTitle6.svg";
import Chip from "@components/Chip";

import OnboardingLayout from "./OnboardingLayout";
import OnboardingMockup from "./OnboardingMockup";

const Onboarding6Page = () => {
  return (
    <OnboardingLayout icon={onboardingIcon} iconAlt="결과지 아이콘">
      <Chip className="mt-7" size="large" prefix="이미지">
        결과지
      </Chip>
      <h1 className="mt-2 text-head1-2">
        게임이 다 끝나면
        <br />
        결과지를 저장할 수 있어요
      </h1>
      <OnboardingMockup
        src={onboardingPhone}
        alt="이미지 결과지 화면 예시"
      />
    </OnboardingLayout>
  );
};

export default Onboarding6Page;
