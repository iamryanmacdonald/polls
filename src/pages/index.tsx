import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="items-stretch min-h-screen p-6 w-screen">
      <Head>
        <title>Home | Polls</title>
      </Head>
      <header className="flex header justify-between w-full">
        <h1 className="font-bold text-4xl">Polls</h1>
        <Link href="/create">
          <a className="bg-gray-300 p-4 rounded text-gray-800">
            Create New Question
          </a>
        </Link>
      </header>
      <div className="grid grid-cols-1 mt-10 md:gap-x-5 md:grid-cols-4">
        {data.map((question) => {
          return (
            <div key={question.id} className="bg-base-100 card shadow-xl">
              <div className="card-body">
                <h1 key={question.id} className="card-title">
                  {question.question}
                </h1>
                <p className="text-sm text-white/30">
                  Created on {question.createdAt.toDateString()}
                </p>
                <div className="card-actions items-center justify-between mt-5">
                  <Link href={`/question/${question.id}`}>
                    <a className="">View</a>
                  </Link>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
