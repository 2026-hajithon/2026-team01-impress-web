import PersonalAnswerGamePage from "./games/PersonalAnswerGamePage";
import PersonalChoiceGamePage from "./games/PersonalChoiceGamePage";
import GeneralChoiceGamePage from "./games/GeneralChoiceGamePage";
import AnswerResultPage from "./games/AnswerResultPage";
import ChoiceResultPage from "./games/ChoiceResultPage";
import VoteResultPage from "./games/VoteResultPage";

const MOCK_PARTICIPANTS = [
  { participantId: 1, name: "김태현" },
  { participantId: 2, name: "김가빈" },
  { participantId: 3, name: "김수현" },
  { participantId: 4, name: "이혁" },
  { participantId: 5, name: "윤소연" },
  { participantId: 6, name: "유영주" },
];

const TestPage = () => {
  return (
    <div className="flex flex-col gap-5 bg-black w-full">
      <PersonalAnswerGamePage
        roomName="하지톤 1팀"
        timeLeft={60}
        targetName="김태현"
        question="이 사람은 주말에 ____를 할 것 같은 인상이다!"
        submitted={false}
        onSubmit={() => {}}
      />
      <PersonalChoiceGamePage
        roomName="하지톤 1팀"
        timeLeft={60}
        targetName="김태현"
        question={`이 사람의 형제관계는\n어떻게 될까?`}
        options={["남매", "자매", "외동", "형제"]}
        submitted={false}
        onSubmit={() => {}}
      />
      <GeneralChoiceGamePage
        roomName="하지톤 1팀"
        timeLeft={60}
        question={`어렸을 때, 가장 엄마 말을 안들었을 것 같은 사람은?`}
        participants={MOCK_PARTICIPANTS}
        submitted={false}
        onSubmit={() => {}}
      />

      <AnswerResultPage
        roomName="하지톤 1팀"
        targetName="김태현"
        question="이 사람은 주말에 ____를 할 것 같은 인상이다!"
        answers={[
          { submitterId: 1, submitterName: "김태현", textAnswer: "카페에서 커피마시면서 조용히 공부" },
          { submitterId: 2, submitterName: "김가빈", textAnswer: "계획 없이 차타고 놀러가기" },
          { submitterId: 3, submitterName: "이혁", textAnswer: "집에서 좋아하는 영화를 보면서 맛있는 음식을 시켜 먹을" },
        ]}
        voteUpdate={null}
        onNext={() => {}}
      />
      <ChoiceResultPage
        roomName="하지톤 1팀"
        targetName="김태현"
        question={`이 사람의 형제 관계는\n어떻게 될까?`}
        options={["남매", "자매", "외동", "형제"]}
        counts={{ 남매: 3, 자매: 0, 외동: 0, 형제: 0 }}
        trueAnswer="남매"
        myAnswer="남매"
        voteUpdate={null}
        onNext={() => {}}
      />
      <VoteResultPage
        roomName="하지톤 1팀"
        question={`어렸을 때, 가장 엄마 말을\n안들었을 것 같은 사람은?`}
        ranking={MOCK_PARTICIPANTS.map((p, idx) => ({
          participantId: p.participantId,
          name: p.name,
          votes: Math.max(0, 4 - idx),
        }))}
        voteUpdate={null}
        onNext={() => {}}
      />
    </div>
  );
};

export default TestPage;
