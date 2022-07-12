import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(["questions.get-by-id", { id }]);

  const { mutate, data: voteResponse } = trpc.useMutation(
    "questions.vote-on-question",
    { onSuccess: () => window.location.reload() }
  );

  if (!data || !data.question) return <div>Question not found</div>;

  return (
    <div className="p-8 flex flex-col">
      {data.isOwner && (
        <div className="bg-red-700 p-3 rounded-md">You made this!</div>
      )}
      <div className="text-2xl font-bold">{data?.question?.question}</div>
      <div className="flex flex-col gap-4">
        {(data?.question?.options as string[])?.map((option: any, index) => {
          if (data?.isOwner || data?.vote) {
            return (
              <div key={index}>
                {data.votes?.[index]?._count ?? 0} - {option.text}
              </div>
            );
          }

          return (
            <button
              key={index}
              onClick={() =>
                mutate({
                  option: index,
                  questionId: data.question!.id,
                })
              }
            >
              {option.text}
            </button>
          );
        })}
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
