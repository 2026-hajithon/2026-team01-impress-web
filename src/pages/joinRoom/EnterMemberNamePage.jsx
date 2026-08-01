import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import CreateRoomGraphic from "@assets/Room/CreateRoom1.svg";
import Button from "@components/Button";
import TextField from "@components/TextField";

import { RoomAPI } from "@apis/RoomAPI";

const EnterMemberNamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const roomCode = location.state?.roomCode;
  const roomName = location.state?.roomName;
  const hostName = location.state?.hostName
  
  const [memberName, setMemberName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    const trimmedName = memberName.trim();

    if (!trimmedName || !roomCode || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const { participantId, roomStatus, role } =
        await RoomAPI.joinRoom(roomCode, trimmedName);

      sessionStorage.setItem("roomCode", roomCode);
      sessionStorage.setItem("roomName", roomName || "");
      sessionStorage.setItem("hostName", hostName || "");
      sessionStorage.setItem("participantId", String(participantId));
      sessionStorage.setItem("participantName", trimmedName);
      sessionStorage.setItem("participantRole", role);

      navigate("/member-waiting", {
        state: {
          roomCode,
          roomName,
          hostName,
          memberName: trimmedName,
          participantId,
          roomStatus,
          role,
        },
      });
    } catch (error) {
      const apiError = error.response?.data?.error;

      setErrorMessage(
        apiError?.message ||
          apiError ||
          "모임방에 입장하지 못했어요.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-white">
      <section
        className={[
          "mx-auto flex min-h-dvh w-full max-w-[430px]",
          "flex-col bg-black",
        ].join(" ")}
      >
        <div className="flex flex-col gap-1.5 p-5 pt-12">
          <img
            src={CreateRoomGraphic}
            alt=""
            className="size-[70px]"
          />

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
            message={ errorMessage || "*최대 20자까지 입력할 수 있어요" }
            autoComplete="name"
          />
        </div>

        <div className="mt-auto flex flex-col gap-2 px-5 pb-8 pt-3">
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!memberName.trim() || !roomCode}
          >
            다음으로
          </Button>

          <Button
            variant="neutral"
            onClick={() => navigate(-1)}
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