import Modal from "@components/Modal";

// 방장이 게임 진행 중 "나가기"를 눌렀을 때 뜨는 확인 모달.
// TODO: 실제 문구/그래픽은 디자인이 나오면 교체 — 지금은 나가기 버튼 동작(트리거)만 연결해둔 상태.
const LeaveGameModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="정말 나가시겠어요?"
    description="방장이 나가면 모임이 종료돼요."
    actionLabel="나가기"
    actionVariant="pink"
    onAction={onConfirm}
    closeOnBackdrop
  />
);

export default LeaveGameModal;
