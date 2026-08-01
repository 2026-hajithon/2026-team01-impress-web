import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import createRoomDoneGraphic from "@assets/Room/CreateRoomDone.svg";
import Modal from "@components/Modal";

import createRoomGraphic from "@assets/Room/CreateRoom2.svg";
import Button from "@components/Button";
import GameBackground from "@components/games/GameBackground";
import TextField from "@components/TextField";
import { RoomAPI } from "@apis/RoomAPI";
import { MODAL_EXIT_DURATION } from "@hooks/useModalPresence";
import { navigateWithTransition } from "@utils/navigateWithTransition";

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const CreateRoomTitlePage = () => {
  const [roomName, setRoomName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdRoomCode, setCreatedRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isEnteringWaitingRef = useRef(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!roomName.trim() || isCreating) return;

    const hostName = location.state?.hostName ?? sessionStorage.getItem("hostName") ?? "방장";
    const trimmedRoomName = roomName.trim();

    setIsCreating(true);
    setErrorMessage("");

    try {
      const { roomCode, participantId, role } = await RoomAPI.createRoom(hostName, trimmedRoomName);

      sessionStorage.setItem("hostName", hostName);
      sessionStorage.setItem("roomName", trimmedRoomName);
      sessionStorage.setItem("roomCode", roomCode);
      sessionStorage.setItem("participantId", String(participantId));
      sessionStorage.setItem("role", role);
      sessionStorage.removeItem("gameMode");
      sessionStorage.removeItem("mockParticipants");

      setCreatedRoomCode(roomCode);
      setIsModalOpen(true);
    } catch (error) {
      console.error("%c[REST ✕] 방 생성 실패", "color:#ff3b9b; font-weight:bold", error);
      setErrorMessage("방 생성에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEnterWaitingRoom = async () => {
    if (isEnteringWaitingRef.current) return;
    isEnteringWaitingRef.current = true;

    setIsModalOpen(false);
    await wait(MODAL_EXIT_DURATION);

    const roomCode = createdRoomCode || sessionStorage.getItem("roomCode") || "LOCAL";
    navigateWithTransition(navigate, `/rooms/${roomCode}/waiting`);
  };

  const handlePrevious = () => {
    navigateWithTransition(navigate, -1, undefined, "backward");
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
          {errorMessage && (
            <p className="text-center text-caption1-2 text-main-pink-1" aria-live="polite">
              {errorMessage}
            </p>
          )}
          <Button
            variant="primary"
            onClick={handleCreateRoom}
            disabled={!roomName.trim() || isCreating}
            loading={isCreating}
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
          onClose={handleEnterWaitingRoom}
          closeOnBackdrop
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
          onAction={handleEnterWaitingRoom}
        />
      </section>
    </main>
  );
};

export default CreateRoomTitlePage;
