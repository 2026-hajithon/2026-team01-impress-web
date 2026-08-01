import Modal from "@components/Modal";

const RoomInfoRow = ({ label, value }) => {
  return (
    <div className="flex w-full items-center gap-2.5">
      <span
        className={[
          "shrink-0 rounded-[10px] bg-gray-950",
          "px-2.5 py-1.25",
          "text-caption1-2 text-gray-300",
        ].join(" ")}
      >
        {label}
      </span>

      <strong className="truncate text-body1-1 text-black">
        {value}
      </strong>
    </div>
  );
};

const ConfirmRoomModal = ({
  isOpen,
  onClose,
  onConfirm,
  roomName,
  hostName,
}) => {
  const roomInformation = (
    <div
      className={[
        "mb-3 flex h-[114px] w-[198px] flex-col",
        "justify-center gap-[15px] rounded-[14px]",
        "bg-gray-100 px-5",
      ].join(" ")}
    >
      <RoomInfoRow label="방 이름" value={roomName} />
      <RoomInfoRow label="방장 이름" value={hostName} />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      graphic={roomInformation}
      title="이 방이 맞나요?"
      description="참여하려는 방이 맞는지 확인해주세요"
      actionLabel="들어가기"
      onAction={onConfirm}
      className="[&_h2+_p]:min-h-12"
    />
  );
};

export default ConfirmRoomModal;