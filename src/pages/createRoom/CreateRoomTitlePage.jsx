import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import createRoomDoneGraphic from "@assets/Room/CreateRoomDone.svg";
import Modal from "@components/Modal";

import createRoomGraphic from "@assets/Room/CreateRoom2.svg";
import Button from "@components/Button";
import TextField from "@components/TextField";

const CreateRoomTitlePage = () => {
  const [roomName, setRoomName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!roomName.trim()) return;

    const hostName = location.state?.hostName ?? sessionStorage.getItem("hostName") ?? "방장";
    const roomCode = String(Math.floor(1000 + Math.random() * 9000));

    sessionStorage.setItem("hostName", hostName);
    sessionStorage.setItem("roomName", roomName.trim());
    sessionStorage.setItem("roomCode", roomCode);
    sessionStorage.setItem("participantId", "1");
    sessionStorage.setItem("role", "HOST");
    sessionStorage.setItem("gameMode", "mock");
    setCreatedRoomCode(roomCode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInvite = () => {
    setIsModalOpen(false);
    const roomCode = createdRoomCode || sessionStorage.getItem("roomCode") || "LOCAL";
    navigate(`/rooms/${roomCode}/waiting`);
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  return (
    <main className="min-h-dvh bg-white">
      <section
        className={[
          "mx-auto flex min-h-dvh w-full max-w-[430px]",
          "flex-col bg-black",
        ].join(" ")}
      >
        <div className="px-5 pt-12">
          <div className="pb-5">
            <img
              src={createRoomGraphic}
              alt=""
              aria-hidden="true"
              className="h-auto w-[18%] max-w-[70px]"
            />

            <h1 className="mt-2 text-head2-1 text-white">
              모임방의 이름을
              <br />
              입력해주세요
            </h1>
          </div>

          <TextField
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={20}
            message="*최대 20자까지 입력할 수 있어요"
            className="mt-5"
          />
        </div>

        <div className="relative z-10 mt-auto flex flex-col gap-2 px-5 pb-8 pt-2">
          <Button
            variant="primary"
            onClick={handleCreateRoom}
            disabled={!roomName.trim()}
          >
            방 만들기
          </Button>

          <Button
            variant="neutral"
            onClick={handlePrevious}
          >
            이전으로
          </Button>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          graphic={
            <img
              src={createRoomDoneGraphic}
              alt=""
              aria-hidden="true"
              className="h-[191px] w-[198px] object-contain"
            />
          }
          title="모임방을 만들었어요!"
          description={
            <>
              이제 모임방에 멤버를 초대해
              <br />
              아이스브레이킹을 시작해보세요
            </>
          }
          actionLabel="초대하기"
          onAction={handleInvite}
        />
      </section>
    </main>
  );
};

export default CreateRoomTitlePage;
