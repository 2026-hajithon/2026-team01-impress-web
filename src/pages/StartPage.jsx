import Button from "@components/Button";

const StartPage = () => {
    const handleCreateRoom = () => {
        // 이름 입력 화면으로 이동할 예정
    };

    const handleJoinRoom = () => {
        // 입장 코드 입력 화면으로 이동할 예정
    };
  return (
    <main className="min-h-dvh bg-white">
      <section
        className={[
          "relative mx-auto flex min-h-dvh w-full max-w-[430px]",
          "flex-col overflow-hidden bg-black",
        ].join(" ")}
      >
        {/* 추후 하단 배경 그래픽이 들어갈 영역 */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          aria-hidden="true"
        />

        {/* 메인 로고 및 그래픽 영역 */}
        <div className="relative flex flex-1 items-center justify-center px-5">
          <div
            className="aspect-square w-3/4 max-w-72"
            aria-label="메인 로고 이미지 영역"
          >
            {/* 추후 디자이너에게 받은 이미지 삽입 */}
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="relative flex flex-col gap-2 pt-2 px-5 pb-8">
          <Button
            variant="primary"
            onClick={handleCreateRoom}
          >
            모임 생성하기
          </Button>

          <Button
            variant="secondary"
            onClick={handleJoinRoom}
          >
            모임 참여하기
          </Button>
        </div>
      </section>
    </main>
  )
}

export default StartPage