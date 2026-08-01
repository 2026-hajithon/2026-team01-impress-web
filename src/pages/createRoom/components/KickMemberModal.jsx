import kickMemberGraphic from "@assets/Room/KickMember.svg";
import Modal from "@components/Modal";

const KickMemberModal = ({
  isOpen,
  participantName,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      graphic={
        <img
          src={kickMemberGraphic}
          alt=""
          aria-hidden="true"
          className="h-[191px] w-[198px] object-contain"
        />
      }
      title={
        <>
          {participantName}님을
          <br />
          모임방에서 퇴장시킬까요?
        </>
      }
      actionLabel="강제퇴장"
      onAction={onConfirm}
    />
  );
};

export default KickMemberModal;