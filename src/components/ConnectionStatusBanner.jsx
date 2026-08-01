import { SOCKET_STATUS } from "@utils/eventTypes";

const STATUS_CONTENT = {
  [SOCKET_STATUS.RECONNECTING]: {
    message: "연결이 끊겨 다시 연결하고 있어요…",
    className: "bg-main-blue/15 text-main-blue-1",
  },
  [SOCKET_STATUS.ERROR]: {
    message: "서버에 연결할 수 없어요. 방에 다시 입장해주세요.",
    className: "bg-main-pink/15 text-main-pink-1",
  },
};

const ConnectionStatusBanner = ({ status }) => {
  const content = STATUS_CONTENT[status];

  if (!content) return null;

  return (
    <p
      role="status"
      className={`mx-5 rounded-xl px-3 py-2 text-center text-caption1-2 ${content.className}`}
    >
      {content.message}
    </p>
  );
};

export default ConnectionStatusBanner;
