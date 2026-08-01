import BackgroundGlow from "@assets/Background/BackgroundGraphic0.svg";
import StarSmall from "@assets/Background/BackgroundGraphic2.svg";
import StarLarge from "@assets/Background/BackgroundGraphic3.svg";

const GameBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-black">
      <img
        src={BackgroundGlow}
        alt=""
        className="absolute bottom-[-140px] left-1/2 w-[1110px] max-w-none -translate-x-1/2"
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
