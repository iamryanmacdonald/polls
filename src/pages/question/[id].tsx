import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(["questions.get-by-id", { id }]);

  if (!isLoading && !data) return <div>Question not found</div>;

  return (
    <div className="p-8 flex flex-col">
      {data?.isOwner && (
        <div className="bg-red-700 p-3 rounded-md">You made this!</div>
      )}
      <div className="text-2xl font-bold">{data?.question?.question}</div>
      <div>
        {(data?.question?.options as string[])?.map((option: any) => (
          <div key={option.text}>{option.text}</div>
        ))}
      </div>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;

  if (!id || typeof id !== "string") return <div>No ID</div>;

  return <QuestionsPageContent id={id} />;
};

export default QuestionPage;
