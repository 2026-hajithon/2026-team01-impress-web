import { useState } from "react";
import { useNavigate } from "react-router-dom";

import createRoomGraphic from "@assets/Room/CreateRoom2.svg";
import Button from "@components/Button";
import TextField from "@components/TextField";

const CreateRoomTitlePage = () => {
  const [roomName, setRoomName] = useState("");

  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // 생성 완료 모달 및 API는 다음 단계에서 연결
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  return (
    <main className="min-h-dvh bg-white">
      <section
        className={[
          "mx-auto flex min-h-dvh w-full max-w-[430px]",
          "flex-col bg-black",
        ].join(" ")}
      >
        <div className="px-5 pt-12">
          <div className="pb-5">
            <img
              src={createRoomGraphic}
              alt=""
              aria-hidden="true"
              className="h-auto w-[18%] max-w-[70px]"
            />

            <h1 className="mt-2 text-head2-1 text-white">
              모임방의 이름을
              <br />
              입력해주세요
            </h1>
          </div>

          <TextField
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            placeholder="이름을 입력하세요"
            maxLength={20}
            message="*최대 20자까지 입력할 수 있어요"
            className="mt-5"
          />
        </div>

        <div className="relative z-10 mt-auto flex flex-col gap-2 px-5 pb-8 pt-2">
          <Button
            variant="primary"
            onClick={handleCreateRoom}
          >
            방 만들기
          </Button>

          <Button
            variant="neutral"
            onClick={handlePrevious}
          >
            이전으로
          </Button>
        </div>
      </section>
    </main>
  );
};

export default CreateRoomTitlePage;