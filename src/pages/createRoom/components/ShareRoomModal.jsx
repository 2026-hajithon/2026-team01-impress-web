import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";

import closeIcon from "@assets/utils/Close.svg";
import copyIcon from "@assets/utils/Copy.svg";

const ShareRoomModal = ({
  isOpen,
  onClose,
  roomName,
  roomCode,
}) => {
  if (!isOpen) return null;

  const displayCode = roomCode || "0000";
  // QR을 폰 기본 카메라로 찍었을 때 바로 입장 화면으로 연결되도록 방 코드가 아니라 링크를 담는다.
  // (앱 내 "QR로 입장하기" 스캐너는 이 링크에서 roomCode만 다시 추출해서 쓴다.)
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const localNetworkHost = import.meta.env.VITE_DEV_LAN_HOST;
  const localNetworkOrigin = localNetworkHost
    ? `${window.location.protocol}//${localNetworkHost}${window.location.port ? `:${window.location.port}` : ""}`
    : window.location.origin;
  const qrOrigin = import.meta.env.DEV && isLocalhost ? localNetworkOrigin : window.location.origin;
  const qrValue = `${qrOrigin}/enter-member-name?roomCode=${displayCode}`;

  const handleCopyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
    } catch (error) {
      console.error("입장 코드를 복사하지 못했습니다.", error);
    }
  };

  return createPortal(
    <div
      className={[
        "fixed inset-0 z-50",
        "flex items-center justify-center",
        "bg-black/[0.44] px-5 py-8",
      ].join(" ")}
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-room-modal-title"
        className={[
          "w-full max-w-[320px] overflow-hidden",
          "-translate-y-[4dvh]",
          "rounded-[25px] bg-white",
        ].join(" ")}
        onClick={(event) => event.stopPropagation()}
      >
        {/* 상단 제목과 닫기 */}
        <header className="grid grid-cols-[32px_1fr_32px] items-center p-2.5">
          <span aria-hidden="true" />

          <h2
            id="share-room-modal-title"
            className="text-sub1-1 text-center text-black"
          >
            {roomName}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="공유 모달 닫기"
            className="size-8"
          >
            <img
              src={closeIcon}
              alt=""
              className="size-full"
            />
          </button>
        </header>

        <div className="flex flex-col gap-[23px] px-5 pb-5 pt-2.5">
          {/* 입장 코드 */}
          <div className="flex flex-col gap-[5px]">
            <span className="text-body1-2 text-gray-500">
              입장코드
            </span>

            <div className="flex items-center gap-2.5">
              <strong className="text-head2-2 text-gray-950">
                {displayCode}
              </strong>

              <button
                type="button"
                onClick={handleCopyRoomCode}
                aria-label="입장 코드 복사"
                className="flex size-6 items-center justify-center"
              >
                <img
                  src={copyIcon}
                  alt=""
                  className="h-5 w-[17px]"
                />
              </button>
            </div>
          </div>

          {/* QR 코드 */}
          <div className="flex flex-col gap-2.5">
            <span className="text-body1-2 text-gray-500">
              QR코드
            </span>

            <div
              className={[
                "flex aspect-square w-full items-center justify-center",
                "rounded-3xl bg-gray-100 p-5",
              ].join(" ")}
            >
              <QRCodeSVG
                value={qrValue}
                size={240}
                level="M"
                bgColor="transparent"
                fgColor="var(--color-black)"
                className="size-full"
              />
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default ShareRoomModal;
