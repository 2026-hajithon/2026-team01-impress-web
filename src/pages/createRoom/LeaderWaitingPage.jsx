import { useState } from "react";

import deleteIcon from "@assets/Room/Delete.svg";
import leaveRoomIcon from "@assets/Room/LeaveRoom.svg";
import roomLeaderIcon from "@assets/Room/RoomLeader.svg";
import shareIcon from "@assets/Room/Share.svg";
import Button from "@components/Button";

import KickMemberModal from "./components/KickMemberModal";
import LeaderLeaveModal from "./components/LeaderLeaveModal";
import ShareRoomModal from "./components/ShareRoomModal";

const initialParticipants = [
  {
    participantId: 1,
    name: "김태현",
    role: "HOST",
  },
  {
    participantId: 2,
    name: "김가빈",
    role: "GUEST",
  },
  {
    participantId: 3,
    name: "김수현",
    role: "GUEST",
  },
  {
    participantId: 4,
    name: "윤소연",
    role: "GUEST",
  },
  {
    participantId: 5,
    name: "이혁",
    role: "GUEST",
  },
  {
    participantId: 6,
    name: "유영주",
    role: "GUEST",
  },
  {
    participantId: 7,
    name: "김이픈",
    role: "GUEST",
  },
  {
    participantId: 8,
    name: "최두지",
    role: "GUEST",
  },
];

const HostWaitingRoomPage = () => {
  const [participants] =
    useState(initialParticipants);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const roomName =
  sessionStorage.getItem("roomName") || "하지톤 1팀";

  const roomCode =
  sessionStorage.getItem("roomCode") || "0801";

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleLeave = () => {   
    setIsLeaveModalOpen(true);
  };

  const handleCloseLeaveModal = () => {
    setIsLeaveModalOpen(false);
  };

  const handleConfirmLeave = () => {
    // 추후 방 나가기 API 연결
    setIsLeaveModalOpen(false);
  };

  const handleKick = (participant) => {
    setSelectedParticipant(participant);
  };

  const handleCloseKickModal = () => {
    setSelectedParticipant(null);
  };

  const handleConfirmKick = () => {
    // 추후 강퇴 WebSocket 연결
    setSelectedParticipant(null);
  };

  const handleStartGame = () => {
    // 웹소켓 연결 후 게임 시작 이벤트 사용
  };

  return (
    <main className="min-h-dvh bg-white">
      <section
        className={[
          "mx-auto flex h-dvh w-full max-w-[430px]",
          "flex-col overflow-hidden bg-black",
        ].join(" ")}
      >
        {/* 상단 모임 이름 */}
        <header className="shrink-0 px-2.5 pb-5 pt-12">
          <h1 className="text-head2-2 text-center text-white">
            하지톤 1팀
          </h1>
        </header>

        {/* 스크롤 영역 */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* 공유하기 */}
          <div className="p-5">
            <button
              type="button"
              onClick={handleShare}
              className={[
                "flex h-[69px] w-full items-center gap-[15px]",
                "rounded-[20px] bg-gray-950",
                "pl-[18px] pr-2.5",
              ].join(" ")}
            >
              <img
                src={shareIcon}
                alt=""
                className="h-[23px] w-5"
              />

              <span className="text-sub1-2 text-white">
                공유하기
              </span>
            </button>
          </div>

          {/* 참여자 수 */}
          <div className="px-5 pb-2.5 pt-5">
            <div className="flex items-center gap-2">
              <span className="text-body1-1 text-white">
                참여자
              </span>

              <span className="text-body1-1 text-main-blue">
                {participants.length}명
              </span>
            </div>
          </div>

          {/* 참여자 목록 */}
          <ul>
            {participants.map((participant) => {
              const isHost = participant.role === "HOST";

              return (
                <li
                  key={participant.participantId}
                  className="flex items-center justify-between px-[30px] py-5"
                >
                  <div className="flex items-center gap-[11px]">
                    <span className="text-sub1-1 text-white">
                      {participant.name}
                    </span>

                    {isHost && (
                      <span
                        className={[
                          "flex items-center gap-[5px]",
                          "rounded-[10px] bg-gray-950",
                          "py-[5px] pl-[7px] pr-2.5",
                        ].join(" ")}
                      >
                        <img
                          src={roomLeaderIcon}
                          alt=""
                          className="size-[15px]"
                        />

                        <span className="text-caption1-2 text-main-pink-2">
                          방장
                        </span>
                      </span>
                    )}
                  </div>

                  {!isHost && (
                    <button
                      type="button"
                      onClick={() =>
                        handleKick(participant)
                      }
                      aria-label={`${participant.name} 강제 퇴장`}
                      className="size-6"
                    >
                      <img
                        src={deleteIcon}
                        alt=""
                        className="size-full"
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 하단 버튼 */}
        <footer className="shrink-0 bg-black px-5 pb-8 pt-3">
          <div
            className={[
              "mx-auto grid w-full justify-center gap-2.5",
              "grid-cols-[auto_minmax(0,204px)]",
            ].join(" ")}
          >
            <Button
              variant="secondary"
              fullWidth={false}
              onClick={handleLeave}
              className="gap-1 pl-4 pr-5"
            >
              <img
                src={leaveRoomIcon}
                alt=""
                className="size-6 object-contain"
              />

              <span className="font-semibold">
                나가기
              </span>
            </Button>

            <Button
              variant="primary"
              onClick={handleStartGame}
            >
              게임 시작하기
            </Button>
          </div>
        </footer>
        <LeaderLeaveModal
            isOpen={isLeaveModalOpen}
            onClose={handleCloseLeaveModal}
            onConfirm={handleConfirmLeave}
        />

        <KickMemberModal
            isOpen={Boolean(selectedParticipant)}
            participantName={selectedParticipant?.name}
            onClose={handleCloseKickModal}
            onConfirm={handleConfirmKick}
        />
        <ShareRoomModal
            isOpen={isShareModalOpen}
            onClose={handleCloseShareModal}
            roomName={roomName}
            roomCode={roomCode}
        />
      </section>
    </main>
  );
};

export default HostWaitingRoomPage;