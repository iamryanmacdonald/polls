import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../shared/create-question-validator";
import { trpc } from "../utils/trpc";

const CreateQuestionForm = () => {
  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<CreateQuestionInputType>({
    defaultValues: {
      options: [{ text: "Yes" }, { text: "No" }],
    },
    resolver: zodResolver(createQuestionValidator),
  });

  const { append, fields, remove } = useFieldArray({
    control,
    name: "options",
  });

  const { data, mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      router.push(`/question/${data.id}`);
    },
  });

  if (isLoading || data)
    return (
      <div className="antialiased flex items-center justify-center min-h-screen">
        <p className="text-white/40">Loading...</p>
      </div>
    );

  return (
    <div className="antialiased min-h-screen px-6 text-gray-100">
      <Head>
        <title>Create | Polls</title>
      </Head>
      <div className="max-w-xl mx-auto py-12 md:max-w-2xl">
        <h2 className="font-bold text-2xl">Create a new poll</h2>
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
          className="w-full"
        >
          <div className="mt-8 w-full">
            <div className="form-control my-10 w-full">
              <label className="label">
                <span className="font-semibold label-text text-base">
                  Your Question
                </span>
              </label>
              <input
                {...register("question")}
                type="text"
                className="block input input-bordered rounded-md text-gray-300 w-full"
              />
              {errors.question && (
                <p className="text-red-400">{errors.question.message}</p>
              )}
            </div>
            <div className="gap-x-5 gap-y-3 grid grid-cols-2 w-full">
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section
                      className="flex items-center space-x-3"
                      key={field.id}
                    >
                      <input
                        placeholder="name"
                        {...register(`options.${index}.text`, {
                          required: true,
                        })}
                        className="font-medium input input-bordered text-gray-300 w-full"
                      />
                      <button type="button" onClick={() => remove(index)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 text-gray-500 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </section>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center my-3">
              <button
                type="button"
                value="Add more options"
                className="btn btn-ghost"
                onClick={() => append({ text: "Another Option" })}
              />
            </div>
            <div className="mt-10 w-full">
              <input
                type="submit"
                className="btn w-full"
                value="Create question"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const QuestionCreator: React.FC = () => {
  return <CreateQuestionForm />;
};

export default QuestionCreator;
