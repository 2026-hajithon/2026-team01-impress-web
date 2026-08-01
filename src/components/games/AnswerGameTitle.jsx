const AnswerGameTitle = () => {
  return (
    <div className="flex flex-col gap-9 w-full items-center">
      {/** Chip */}
      <div className="flex flex-col gap-4 w-full items-center">
        <div className="text-white text-head1-1">질문 앞부분</div>
        <input
          type="text"
          className="w-full mx-5 py-4 text-center rounded-[20px] bg-gray-950 text-head3-2 text-main-blue placeholder:text-gray-700"
          placeholder="이미지를 상상해서 입력하세요"
        />
        <div className="text-white text-head1-1">질문 뒷부분</div>
      </div>
    </div>
  );
};

export default AnswerGameTitle;
