import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import CreateRoomGraphic from "@assets/Room/CreateRoom1.svg";
import Button from "@components/Button";
import GameBackground from "@components/games/GameBackground";
import TextField from "@components/TextField";
import { RoomAPI } from "@apis/RoomAPI";
import { navigateWithTransition } from "@utils/navigateWithTransition";

const EnterMemberNamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 앱 내 코드/QR 입력 흐름(state)뿐 아니라, QR을 폰 기본 카메라로 찍어 이 페이지로
  // 바로 들어온 경우(쿼리스트링)도 지원한다.
  const roomCode = location.state?.roomCode || searchParams.get("roomCode");
  const [memberName, setMemberName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    const trimmedName = memberName.trim();

    if (!trimmedName || !roomCode || isJoining) return;

    setIsJoining(true);
    setErrorMessage("");

    try {
      const { participantId, role } = await RoomAPI.joinRoom(
        roomCode,
        trimmedName,
      );

      const roomName = location.state?.roomName ?? "";
      const hostName = location.state?.hostName ?? "";

      sessionStorage.setItem("roomCode", roomCode);
      sessionStorage.setItem("roomName", roomName);
      sessionStorage.setItem("participantId", String(participantId));
      sessionStorage.setItem("role", role);
      sessionStorage.removeItem("gameMode");
      sessionStorage.removeItem("mockParticipants");

      // 참여 API가 발급한 participantId/role을 저장한 뒤 정식 대기방 경로로 이동한다.
      // WaitingRoomRoute가 role을 확인해 일반 참여자 화면을 렌더링하고 useRoomSocket이 연결된다.
      navigateWithTransition(navigate, `/rooms/${roomCode}/waiting`, {
        state: { roomCode, roomName, hostName, memberName: trimmedName, participantId },
      });
    } catch (error) {
      console.error(
        "%c[REST ✕] 방 참여 실패",
        "color:#ff3b9b; font-weight:bold",
        error,
      );
      setErrorMessage("방 참여에 실패했어요. 입장 코드를 다시 확인해주세요.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="min-h-dvh bg-gray-950">
      <section
        className={[
          "relative isolate mx-auto flex min-h-dvh w-full max-w-[500px]",
          "flex-col bg-black",
        ].join(" ")}
      >
        <GameBackground />

        <div className="flex flex-col gap-1.5 p-5 pt-12">
          <img src={CreateRoomGraphic} alt="" className="size-[70px]" />

          <h1 className="text-head2-1 text-white">
            모임방에 입장하기 전,
            <br />
            이름을 입력해주세요
          </h1>
        </div>

        <div className="p-5">
          <TextField
            value={memberName}
            onChange={(event) => setMemberName(event.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={20}
            message={errorMessage || "*최대 20자까지 입력할 수 있어요"}
            autoComplete="name"
          />
        </div>

        <div className="mt-auto flex flex-col gap-2 px-5 pb-8 pt-3">
          {errorMessage && (
            <p
              className="text-center text-caption1-2 text-main-pink-1"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!memberName.trim() || !roomCode || isJoining}
            loading={isJoining}
          >
            다음으로
          </Button>

          <Button
            variant="neutral"
            onClick={() => navigateWithTransition(navigate, -1, undefined, "backward")}
            className="text-gray-200"
          >
            이전으로
          </Button>
        </div>
      </section>
    </main>
  );
};

export default EnterMemberNamePage;
