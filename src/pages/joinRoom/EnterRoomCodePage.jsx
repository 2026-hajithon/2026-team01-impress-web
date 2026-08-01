import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Arrow from "@assets/Room/Arrow.svg";
import EnterRoomGraphic from "@assets/Room/EnterRoom.svg";
import Button from "@components/Button";
import TextField from "@components/TextField";

import ConfirmRoomModal from "@pages/joinRoom/components/ConfirmRoomModal";



const EnterRoomCodePage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleChangeRoomCode = (event) => {
    const numbersOnly = event.target.value.replace(/\D/g, "");
    setRoomCode(numbersOnly.slice(0, 4));
  };

  const handleSubmit = () => {
    if (roomCode.length !== 4) return;

    setIsConfirmModalOpen(true);
  };

  const handleConfirmEntry = () => {
    navigate("/enter-member-name", {
        state: { roomCode },
    });
  };

  const handleQrEntry = () => {
    navigate("/scan-room-qr");
  };

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-black">
      <section className="flex min-h-dvh flex-col">
        <div className="flex h-[68px] items-center px-5 pt-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="이전 화면으로 이동"
            className="flex size-6 items-center justify-center"
          >
            <img
                src={Arrow}
                alt=""
                className="size-6"
            />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <img
            src={EnterRoomGraphic}
            alt=""
            className="size-[70px]"
          />

          <h1 className="text-head2-1 text-white">
            모임방에 들어가기 위해
            <br />
            입장코드를 입력해주세요
          </h1>
        </div>

        <div className="p-5">
          <TextField
            value={roomCode}
            onChange={handleChangeRoomCode}
            placeholder="입장코드를 입력하세요"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            aria-label="모임방 입장코드"
          />
        </div>

        <div className="mt-auto flex flex-col gap-2.5 px-5 pb-8 pt-3">
          <Button
            onClick={handleSubmit}
            disabled={roomCode.length !== 4}
          >
            입력 완료
          </Button>

          <Button
            variant="neutral"
            onClick={handleQrEntry}
            className="text-gray-200"
          >
            또는 QR로 입장하기
          </Button>
        </div>
      </section>
      <ConfirmRoomModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmEntry}
        roomName="하지톤 1팀"
        hostName="김태현"
      />
    </main>
  );
};

export default EnterRoomCodePage;