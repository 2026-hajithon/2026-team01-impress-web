import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LeaveRoom from "@assets/Room/LeaveRoom.svg";
import RoomLeader from "@assets/Room/RoomLeader.svg";
import Share from "@assets/Room/Share.svg";
import Button from "@components/Button";
import ShareRoomModal from "@pages/createRoom/components/ShareRoomModal";

const mockParticipants = [
  { participantId: 1, name: "김태현", role: "HOST" },
  { participantId: 2, name: "김가빈", role: "GUEST" },
  { participantId: 3, name: "김수현", role: "GUEST" },
  { participantId: 4, name: "윤소연", role: "GUEST" },
  { participantId: 5, name: "이혁", role: "GUEST" },
  { participantId: 6, name: "유영주", role: "GUEST" },
];

const MemberWaitingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const roomCode = location.state?.roomCode || "1234";
  const roomName = location.state?.roomName || "하지톤 1팀";
  const memberName = location.state?.memberName || "김가빈";

  const participants = [
    ...mockParticipants,
    {
        participantId: mockParticipants.length + 1,
        name: memberName,
        role: "GUEST",
    },
    ];

  const handleLeaveRoom = () => {
        navigate("/start");
  };

  return (
    <main className="min-h-dvh bg-white">
      <section
        className={[
          "mx-auto flex min-h-dvh w-full max-w-[430px]",
          "flex-col overflow-hidden bg-black",
        ].join(" ")}
      >
        <header className="flex shrink-0 items-center justify-center px-2.5 pb-5 pt-12">
          <h1 className="text-head2-2 text-white">
            {roomName}
          </h1>
        </header>

        <div className="shrink-0 px-5 py-5">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className={[
              "flex h-[69px] w-full items-center gap-[15px]",
              "rounded-[20px] bg-gray-950 px-[18px]",
            ].join(" ")}
          >
            <img
              src={Share}
              alt=""
              className="h-[23px] w-5"
            />

            <span className="text-sub1-2 text-white">
              공유하기
            </span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-2 px-5 pb-2.5 pt-5">
            <span className="text-body1-1 text-white">
              참여자
            </span>

            <span className="text-body1-1 text-main-blue">
              {participants.length}명
            </span>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto">
            {participants.map((participant) => (
              <li
                key={participant.participantId}
                className="flex items-center px-[30px] py-5"
              >
                <span className="text-sub1-1 text-white">
                  {participant.name}
                </span>

                {participant.role === "HOST" && (
                  <span
                    className={[
                      "ml-[11px] inline-flex items-center gap-1",
                      "rounded-[10px] bg-gray-950",
                      "py-1.25 pl-[7px] pr-2.5",
                    ].join(" ")}
                  >
                    <img
                      src={RoomLeader}
                      alt=""
                      className="size-[15px]"
                    />

                    <span className="text-caption1-2 text-main-pink-2">
                      방장
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <footer className="shrink-0 px-5 pb-8 pt-3">
          <Button
            variant="secondary"
            onClick={handleLeaveRoom}
          >
            <span className="flex items-center gap-1">
              <img
                src={LeaveRoom}
                alt=""
                className="size-6"
              />
              나가기
            </span>
          </Button>
        </footer>
      </section>

      <ShareRoomModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        roomName={roomName}
        roomCode={roomCode}
      />
    </main>
  );
};

export default MemberWaitingPage;