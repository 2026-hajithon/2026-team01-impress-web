import { useState } from "react";
import { RoomAPI } from "@apis/RoomAPI";
import TextField from "@components/TextField";
import Button from "@components/Button";

const SERVER_URL = import.meta.env.VITE_PUBLIC_URL;

const Field = ({ label, ...props }) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-caption1-2 text-gray-400">{label}</span>
    <TextField {...props} />
  </label>
);

const STATUS_STYLE = {
  ok: "border-main-blue-1 bg-main-blue-3/10 text-main-blue-1",
  error: "border-main-pink bg-main-pink-3/10 text-main-pink-1",
};

// 백엔드 REST API가 실제로 붙는지 눈으로 바로 확인하는 용도. axiosClient가 이미
// 모든 요청/응답/실패를 콘솔에 색깔별로 찍어주므로, 여기서는 결과를 화면에도 보여주기만 한다.
const ApiConnectionTestPage = () => {
  const [hostName, setHostName] = useState("김테스트");
  const [roomName, setRoomName] = useState("API 연결 테스트방");
  const [joinName, setJoinName] = useState("이참가");
  const [roomCode, setRoomCode] = useState("");
  const [participantId, setParticipantId] = useState("");

  const [loadingLabel, setLoadingLabel] = useState(null);
  const [result, setResult] = useState(null); // { label, status: "ok" | "error", data }

  const run = async (label, fn) => {
    setLoadingLabel(label);
    try {
      const data = await fn();
      setResult({ label, status: "ok", data });
    } catch (error) {
      setResult({
        label,
        status: "error",
        data: {
          message: error.message,
          httpStatus: error.response?.status,
          body: error.response?.data,
        },
      });
    } finally {
      setLoadingLabel(null);
    }
  };

  const handleCreateRoom = () =>
    run("방 생성 — POST /api/rooms", async () => {
      const data = await RoomAPI.createRoom(hostName, roomName);
      if (data?.roomCode) setRoomCode(data.roomCode);
      if (data?.participantId !== undefined) setParticipantId(String(data.participantId));
      return data;
    });

  const handleJoinRoom = () =>
    run(`방 참여 — POST /api/rooms/${roomCode}/join`, async () => {
      const data = await RoomAPI.joinRoom(roomCode, joinName);
      if (data?.participantId !== undefined) setParticipantId(String(data.participantId));
      return data;
    });

  const handleSyncStatus = () =>
    run(`상태 동기화 — GET /api/rooms/${roomCode}/sync`, () =>
      RoomAPI.syncStatus(roomCode, Number(participantId)),
    );

  const handleGetResult = () =>
    run(`결과 조회 — GET /api/rooms/${roomCode}/result`, () =>
      RoomAPI.getResult(roomCode, Number(participantId)),
    );

  const handleLeaveRoom = () =>
    run(`나가기 — DELETE /api/rooms/${roomCode}/participants/me`, () =>
      RoomAPI.leaveRoom(roomCode, Number(participantId)),
    );

  const hasRoom = Boolean(roomCode) && participantId !== "";

  return (
    <div className="flex min-h-dvh flex-col gap-6 bg-black p-5">
      <div className="flex flex-col gap-1">
        <p className="text-head3-1 text-white">REST API 연결 테스트</p>
        <p className="text-caption1-2 text-gray-500">
          현재 서버: <span className="text-gray-300">{SERVER_URL || "(설정 안 됨)"}</span>
          {" · "}요청/응답 전체 내용은 콘솔에도 그대로 찍혀요.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-gray-950 p-4">
        <p className="text-body1-1 text-white">1. 방 생성</p>
        <Field label="방장 이름" value={hostName} onChange={(e) => setHostName(e.target.value)} />
        <Field label="모임방 이름" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <Button
          variant="secondary"
          onClick={handleCreateRoom}
          loading={loadingLabel === "방 생성 — POST /api/rooms"}
        >
          방 생성 요청
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-gray-950 p-4">
        <p className="text-body1-1 text-white">2. 방/참가자 정보</p>
        <p className="text-caption1-2 text-gray-500">
          방을 생성하면 자동으로 채워져요. 이미 있는 방을 테스트하려면 직접 입력해도 돼요.
        </p>
        <Field label="방 코드 (roomCode)" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
        <Field
          label="참가자 ID (participantId)"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
        />
        <Field label="참여할 이름 (join용)" value={joinName} onChange={(e) => setJoinName(e.target.value)} />
        <Button
          variant="neutral"
          onClick={handleJoinRoom}
          disabled={!roomCode}
          loading={loadingLabel?.startsWith("방 참여")}
        >
          방 참여 요청
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-gray-950 p-4">
        <p className="text-body1-1 text-white">3. 나머지 API</p>
        <div className="flex flex-col gap-2">
          <Button
            variant="neutral"
            onClick={handleSyncStatus}
            disabled={!hasRoom}
            loading={loadingLabel?.startsWith("상태 동기화")}
          >
            상태 동기화 (syncStatus)
          </Button>
          <Button
            variant="neutral"
            onClick={handleGetResult}
            disabled={!hasRoom}
            loading={loadingLabel?.startsWith("결과 조회")}
          >
            최종 결과 조회 (getResult)
          </Button>
          <Button
            variant="pink"
            onClick={handleLeaveRoom}
            disabled={!hasRoom}
            loading={loadingLabel?.startsWith("나가기")}
          >
            나가기 (leaveRoom)
          </Button>
        </div>
      </div>

      {result && (
        <div className={`flex flex-col gap-2 rounded-2xl border p-4 ${STATUS_STYLE[result.status]}`}>
          <p className="text-body2-1">
            {result.status === "ok" ? "✅ 성공" : "❌ 실패"} — {result.label}
          </p>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all text-caption1-2 text-white">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionTestPage;
