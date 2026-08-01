import { useState } from "react";
import LeaveGameModal from "./LeaveGameModal";

// 테스트 페이지 전용: 방장 "나가기" 버튼 + 확인 모달을 케이스에서 그대로 체험해볼 수 있게 감싸는 래퍼.
const HostLeaveDemo = ({ children, onConfirm }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {children(() => setOpen(true))}
      <LeaveGameModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onConfirm?.();
          setOpen(false);
        }}
      />
    </>
  );
};

export default HostLeaveDemo;
