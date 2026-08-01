import { useRoomSocket } from "@hooks/useRoomSocket";

import { RoomAPI } from "@apis/RoomAPI";
import { socketClient } from "@apis/socketClient";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LeaveRoom from "@assets/Room/LeaveRoom.svg";
import RoomLeader from "@assets/Room/RoomLeader.svg";
import Share from "@assets/Room/Share.svg";
import Button from "@components/Button";
import ConnectionStatusBanner from "@components/ConnectionStatusBanner";
import ShareRoomModal from "@pages/createRoom/components/ShareRoomModal";

const clearMemberSession = () => {
  [
    "roomCode",
    "roomName",
    "hostName",
    "participantId",
    "participantName",
    "participantRole",
    "role",
    "gameMode",
    "mockParticipants",
  ].forEach((key) => sessionStorage.removeItem(key));
};

const MemberWaitingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [isLeaving, setIsLeaving] = useState(false);

  const storedParticipantId =
    sessionStorage.getItem("participantId");

  const roomCode =
    location.state?.roomCode ||
    sessionStorage.getItem("roomCode");

  const roomName =
    location.state?.roomName ||
    sessionStorage.getItem("roomName") ||
    "모임방";

  const participantId =
    location.state?.participantId ??
    (storedParticipantId
      ? Number(storedParticipantId)
      : null);
      
  const { status, participants, round, kicked } = useRoomSocket({
    roomCode,
    participantId,
  });

  // 방장이 "게임 시작하기"를 눌러 서버가 실제로 ROUND_START를 방송한 뒤에만 다음 화면으로 넘어간다
  // (HostWaitingRoomPage와 동일한 규칙 — 5.1 참고).
  useEffect(() => {
    if (round) navigate(`/rooms/${roomCode}/countdown`);
  }, [round, roomCode, navigate]);

  // 강퇴당하면(4.3) 홈으로 돌려보낸다.
  useEffect(() => {
    if (!kicked) return;

    clearMemberSession();

    navigate("/", { replace: true });
  }, [kicked, navigate]);

  const handleLeaveRoom = async () => {
    if (isLeaving) return;

    setIsLeaving(true);

    try {
      if (roomCode && participantId) {
        await RoomAPI.leaveRoom(roomCode, participantId);
      }
    } catch (error) {
      // 서버 세션이 이미 만료되었으면 REST 나가기 요청은 실패할 수 있다.
      // 사용자의 화면 이탈은 막지 않고 로컬 연결과 세션만 확실히 정리한다.
      console.warn("[REST] 방 나가기 요청 실패 — 로컬에서 나가기를 계속합니다.", error);
    } finally {
      try {
        await socketClient.disconnect();
      } catch (error) {
        console.warn("[WS] 연결 정리 실패 — 홈 이동을 계속합니다.", error);
      }
      clearMemberSession();
      navigate("/", { replace: true });
    }
  };

  return (
    <main className="min-h-dvh bg-gray-950">
      <section
        className={[
          "mx-auto flex min-h-dvh w-full max-w-[500px]",
          "flex-col overflow-hidden bg-black",
        ].join(" ")}
      >
        <header className="flex shrink-0 items-center justify-center px-2.5 pb-5 pt-12">
          <h1 className="text-head2-2 text-white">
            {roomName}
          </h1>
        </header>

        <ConnectionStatusBanner status={status} />

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
            loading={isLeaving}
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
