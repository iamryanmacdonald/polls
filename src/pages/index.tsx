import type { NextPage } from "next";

import { trpc } from "../utils/trpc";

const QuestionCreator: React.FC = () => {
  const { mutate } = trpc.useMutation("questions.create");

  return (
    <input
      onSubmit={(event) => {
        event.preventDefault();
        console.log(event.currentTarget.value);
      }}
    ></input>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex flex-col">
        <div className="text-2xl font-bold">Questions</div>
        {data[0]?.question}
      </div>
      <QuestionCreator />
    </div>
  );
};

export default Home;
