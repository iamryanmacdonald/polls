import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="p-6 flex flex-col">
      <div className="header flex justify-between w-full">
        <span className="text-2xl font-bold">Your Questions</span>
        <Link href="/create">
          <a className="bg-gray-300 p-4 rounded text-gray-800">
            Create New Question
          </a>
        </Link>
      </div>
      <div className="flex flex-col">
        {data.map((question) => {
          return (
            <Link key={question.id} href={`/question/${question.id}`}>
              <a>
                <div className="flex flex-col my-2">
                  <div>{question.question}</div>
                  <span>Created on {question.createdAt.toDateString()}</span>
                </div>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
