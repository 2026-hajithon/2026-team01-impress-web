import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import deleteIcon from "@assets/Room/Delete.svg";
import leaveRoomIcon from "@assets/Room/LeaveRoom.svg";
import roomLeaderIcon from "@assets/Room/RoomLeader.svg";
import shareIcon from "@assets/Room/Share.svg";
import Button from "@components/Button";
import ConnectionStatusBanner from "@components/ConnectionStatusBanner";
import { RoomAPI } from "@apis/RoomAPI";
import { socketClient } from "@apis/socketClient";
import { useRoomSocket } from "@hooks/useRoomSocket";
import { isHostRole } from "@utils/participantRoles";

import KickMemberModal from "./components/KickMemberModal";
import LeaderLeaveModal from "./components/LeaderLeaveModal";
import ShareRoomModal from "./components/ShareRoomModal";

const clearRoomSession = () => {
  ["hostName", "roomName", "roomCode", "participantId", "role", "gameMode", "mockParticipants"].forEach(
    (key) => sessionStorage.removeItem(key),
  );
};

const HostWaitingRoomPage = () => {
  const navigate = useNavigate();
  const { roomCode: routeRoomCode } = useParams();

  const roomName = sessionStorage.getItem("roomName") || "하지톤 1팀";
  const roomCode = routeRoomCode || sessionStorage.getItem("roomCode") || "0801";
  const participantId = Number(sessionStorage.getItem("participantId"));
  const hostName = sessionStorage.getItem("hostName") || "방장";
  const isHost = isHostRole(sessionStorage.getItem("role"));

  const { status, participants, round, kicked, actions } = useRoomSocket({
    roomCode,
    participantId,
    mockHostName: hostName,
  });

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 방장이 강퇴당하는 경우는 없지만, 참가자 전용 컴포넌트를 공유하는 useRoomSocket 계약을 그대로 따른다.
  useEffect(() => {
    if (!kicked) return;
    clearRoomSession();
    navigate("/start", { replace: true });
  }, [kicked, navigate]);

  // "게임 시작하기" 클릭 자체가 아니라, 서버가 실제로 ROUND_START를 방송한 뒤에만 다음 화면으로 넘어간다.
  useEffect(() => {
    if (round) navigate(`/rooms/${roomCode}/countdown`);
  }, [round, roomCode, navigate]);

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

  const handleConfirmLeave = async () => {
    setIsLeaveModalOpen(false);

    try {
      await RoomAPI.leaveRoom(roomCode, participantId);
    } catch (error) {
      console.error("%c[REST ✕] 방 나가기 실패", "color:#ff3b9b; font-weight:bold", error);
    } finally {
      socketClient.disconnect();
      clearRoomSession();
      navigate("/start", { replace: true });
    }
  };

  const handleKick = (participant) => {
    setSelectedParticipant(participant);
  };

  const handleCloseKickModal = () => {
    setSelectedParticipant(null);
  };

  const handleConfirmKick = () => {
    if (selectedParticipant) actions.kick(selectedParticipant.participantId);
    setSelectedParticipant(null);
  };

  const handleStartGame = () => {
    if (!isHost) return;
    actions.start();
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
            {roomName}
          </h1>
        </header>

        <ConnectionStatusBanner status={status} />

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
          <div className="grid w-full grid-cols-[120px_minmax(0,1fr)] gap-2.5">
            <Button
              variant="secondary"
              onClick={handleLeave}
              className="gap-1"
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

            {isHost && (
              <Button
                variant="primary"
                onClick={handleStartGame}
              >
                게임 시작하기
              </Button>
            )}
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
