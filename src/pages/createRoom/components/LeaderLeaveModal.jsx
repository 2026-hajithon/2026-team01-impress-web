import deleteRoomGraphic from "@assets/Room/DeleteRoom.svg";
import Modal from "@components/Modal";

const LeaderLeaveModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      graphic={
        <img
          src={deleteRoomGraphic}
          alt=""
          aria-hidden="true"
          className="h-[191px] w-[198px] object-contain"
        />
      }
      title={
        <>
          지금 방을 나가면,
          <br />
          방이 폭파돼요.
        </>
      }
      description={
        <>
          방장이 방을 나가면, 만들어진 방은
          <br />
          자동적으로 없어져요.
        </>
      }
      actionLabel="방 폭파하기"
      onAction={onConfirm}
    />
  );
};

export default LeaderLeaveModal;