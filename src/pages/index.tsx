import type { NextPage } from "next";

import { prisma } from "../db/client";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return <div>{data[0]?.question}</div>;
};

export default Home;
