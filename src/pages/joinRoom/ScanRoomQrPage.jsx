import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

import Arrow from "@assets/Room/Arrow.svg";
import QrGraphic from "@assets/Room/Qr.svg";
import Button from "@components/Button";

import ConfirmRoomModal from "@pages/joinRoom/components/ConfirmRoomModal";

const ScanRoomQrPage = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);
  const [cameraError, setCameraError] = useState("");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [scannedRoomCode, setScannedRoomCode] = useState("");
  const [scannerSession, setScannerSession] = useState(0);

  const handleCloseConfirmModal = () => {
        hasScannedRef.current = false;
        setScannedRoomCode("");
        setIsConfirmModalOpen(false);
        setScannerSession((previous) => previous + 1);
    };

  const handleConfirmEntry = () => {
        navigate("/enter-member-name", {
            state: { roomCode: scannedRoomCode },
        });
  };

  useEffect(() => {
    const scanner = new Html5Qrcode("room-qr-reader");
    scannerRef.current = scanner;

    const handleScanSuccess = async (decodedText) => {
      if (hasScannedRef.current) return;

      const roomCode = decodedText.trim();

      if (!/^\d{4}$/.test(roomCode)) return;

      hasScannedRef.current = true;

      if (scanner.isScanning) {
        await scanner.stop();
      }

      setScannedRoomCode(roomCode);
      setIsConfirmModalOpen(true);
    };


    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          handleScanSuccess,
          () => {},
        );
      } catch {
        setCameraError("카메라를 사용할 수 없어요.");
      }
    };

    startScanner();

    return () => {
      const currentScanner = scannerRef.current;
      scannerRef.current = null;

      if (currentScanner?.isScanning) {
        currentScanner
          .stop()
          .then(() => currentScanner.clear())
          .catch(() => {});
      } else {
        currentScanner?.clear();
      }
    };
  }, [scannerSession]);

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
            <img src={Arrow} alt="" className="size-6" />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <img
            src={QrGraphic}
            alt=""
            aria-hidden="true"
            className="size-[70px]"
            />

          <h1 className="text-head2-1 text-white">
            모임방에 들어가기 위해
            <br />
            QR코드를 인식해주세요
          </h1>
        </div>

        <div className="px-5 pt-3">
          <div
            id="room-qr-reader"
            className={[
              "aspect-square w-full overflow-hidden bg-gray-200",
              "[&_video]:!h-full [&_video]:!w-full",
              "[&_video]:object-cover",
            ].join(" ")}
          />

          {cameraError && (
            <p className="mt-2 text-caption1-2 text-main-pink">
              {cameraError}
            </p>
          )}
        </div>

        <div className="mt-auto px-5 pb-8 pt-3">
          <Button
            variant="neutral"
            onClick={() => navigate("/start")}
            className="text-gray-200"
          >
            홈화면으로 돌아가기
          </Button>
        </div>
      </section>
      <ConfirmRoomModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmEntry}
        roomName="하지톤 1팀"
        hostName="김태현"
    />
    </main>
  );
};

export default ScanRoomQrPage;