import { PollQuestion } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import React from "react";

import QuestionCard from "../components/QuestionCard";
import { trpc } from "../utils/trpc";

export default function Home() {
  const [showToast, setShowToast] = React.useState(false);
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);

  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

  const copyToClipboard = (question: PollQuestion) => {
    navigator.clipboard.writeText(`${url}/question/${question.id}`);
    setShowToast(true);

    setTimeout(() => setShowToast(false), 1500);
  };

  return (
    <div className="items-stretch min-h-screen p-6 relative w-screen">
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
        {data?.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            copyToClipboard={copyToClipboard}
          />
        ))}
      </div>
      {showToast && (
        <div className="absolute bg-slate-50/10 bottom-5 flex items-center justify-center p-3 right-10 rounded-md w-1/5">
          <span className="font-semibold text-xs">
            Link Copied to Clipboard!
          </span>
        </div>
      )}
    </div>
  );
}
