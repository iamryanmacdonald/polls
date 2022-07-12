import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";

import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../shared/create-question-validator";
import { trpc } from "../utils/trpc";

const CreateQuestionForm = () => {
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
  });

  const { data, mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      router.push(`/question/${data.id}`);
    },
  });

  const onSubmit = (data: any) => console.log(data);

  if (isLoading || data) return <div>Loading...</div>;

  return (
    <div className="antialiased px-6 text-gray-100">
      <div className="max-w-xl mx-auto py-12 md:max-w-4xl">
        <h2 className="font-bold text-2xl">Reset styles</h2>
        <p className="mt-2 text-gray-300 text-lg">
          These are form elements this plugin styles by default.
        </p>
        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
        >
          <div className="gap-6 grid grid-cols-1 items-start mt-8 md:grid-cols-2">
            <div className="col-span-2 gap-6 grid grid-cols-1">
              <label className="block">
                <span className="text-gray-200">Question</span>
                <input
                  {...register("question")}
                  type="text"
                  className="block form-input mt-1 text-gray-800 w-full"
                  placeholder="How do magnets work?"
                />
              </label>
              {errors.question && (
                <p className="text-red-400">{errors.question.message}</p>
              )}
            </div>
            <div className="col-span-2 gap-6 grid grid-cols-1">
              <label className="block">
                <input
                  type="submit"
                  className="form-input text-gray-900"
                  value="Create question"
                />
              </label>
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
