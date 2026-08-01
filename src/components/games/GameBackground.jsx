import BackgroundGlow from "@assets/Background/BackgroundGraphic0.svg";
import BlobSmall from "@assets/Background/BackgroundGraphic1.svg";
import StarSmall from "@assets/Background/BackgroundGraphic2.svg";
import StarLarge from "@assets/Background/BackgroundGraphic3.svg";

// 게임/결과 화면 전반에서 재사용하는 공통 배경. 하단 그라데이션 글로우 + 좌하단 별 장식 +
// 우상단 블롭 장식으로 구성된다.
const GameBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-black">
      <img
        src={BackgroundGlow}
        alt=""
        className="absolute bottom-[-140px] left-1/2 w-[1110px] max-w-none -translate-x-1/2"
      />
      <img
        src={BlobSmall}
        alt=""
        className="absolute -right-2 top-[27%] size-11 mix-blend-hard-light"
      />
      <img
        src={StarLarge}
        alt=""
        className="absolute -bottom-25 left-57.75 size-61.75 rotate-[-165deg] mix-blend-hard-light"
      />
      <img
        src={StarSmall}
        alt=""
        className="absolute bottom-15 -left-10 size-39.75 rotate-[-165deg] mix-blend-hard-light"
      />
    </div>
  );
};

export default GameBackground;
