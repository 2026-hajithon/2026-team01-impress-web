import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@components/Button";
import TextField from "@components/TextField";
import GameBackground from "@components/games/GameBackground";
import { useFrontendTest } from "../FrontendTestContext";

const SettingChoices = ({ label, value, options, suffix, onChange }) => (
  <fieldset className="flex flex-col gap-2.5">
    <legend className="mb-2.5 text-body2-2 text-gray-400">{label}</legend>
    <div className="grid grid-cols-4 gap-2">
      {options.map((option) => {
        const isSelected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={[
              "h-11 rounded-[14px] border text-body2-1 transition-colors",
              isSelected
                ? "border-main-blue bg-main-blue text-white"
                : "border-gray-900 bg-black/70 text-gray-400",
            ].join(" ")}
            aria-pressed={isSelected}
          >
            {option}{suffix}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const FrontendTestSetupPage = () => {
  const navigate = useNavigate();
  const { startSession } = useFrontendTest();
  const [hostName, setHostName] = useState("김태현");
  const [roomName, setRoomName] = useState("프론트 테스트방");
  const [participantCount, setParticipantCount] = useState(5);
  const [roundDuration, setRoundDuration] = useState(15);

  const handleStart = () => {
    if (!hostName.trim() || !roomName.trim()) return;
    startSession({
      hostName: hostName.trim(),
      roomName: roomName.trim(),
      participantCount,
      roundDuration,
    });
    navigate("/waiting");
  };

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[500px] flex-col overflow-hidden bg-black px-5 py-10">
      <GameBackground />
      <div className="relative flex flex-1 flex-col gap-7">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full bg-main-blue/15 px-3 py-1 text-caption1-1 text-main-blue-1">
            FRONTEND ONLY
          </span>
          <h1 className="text-head1-1 text-white">통합 게임 테스트</h1>
          <p className="text-body2-2 text-gray-400">
            API와 웹소켓을 호출하지 않고 실제 화면 컴포넌트만으로 한 게임을 진행합니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-[24px] bg-gray-950/80 p-5">
          <label className="flex flex-col gap-2 text-body2-2 text-gray-400">
            방장 이름
            <TextField value={hostName} onChange={(event) => setHostName(event.target.value)} maxLength={20} />
          </label>
          <label className="flex flex-col gap-2 text-body2-2 text-gray-400">
            모임방 이름
            <TextField value={roomName} onChange={(event) => setRoomName(event.target.value)} maxLength={20} />
          </label>
          <SettingChoices
            label="참가자 수"
            value={participantCount}
            options={[2, 3, 4, 5, 6, 7, 8]}
            suffix="명"
            onChange={setParticipantCount}
          />
          <SettingChoices
            label="문제당 제한시간"
            value={roundDuration}
            options={[5, 15, 30, 60]}
            suffix="초"
            onChange={setRoundDuration}
          />
        </div>

        <div className="mt-auto">
          <Button onClick={handleStart} disabled={!hostName.trim() || !roomName.trim()}>
            테스트 세션 만들기
          </Button>
        </div>
      </div>
    </main>
  );
};

export default FrontendTestSetupPage;
