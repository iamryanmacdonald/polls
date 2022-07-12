import { zodResolver } from "@hookform/resolvers/zod";
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

  if (isLoading || data) return <div>Loading...</div>;

  return (
    <div className="antialiased px-6 text-gray-100">
      <div className="max-w-xl mx-auto py-12 md:max-w-4xl">
        <h2 className="font-bold text-2xl">Create a new poll</h2>
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
            {fields.map((field, index) => {
              return (
                <div key={field.id}>
                  <section className="section">
                    <input
                      placeholder="name"
                      {...register(`options.${index}.text`, {
                        required: true,
                      })}
                      className="block form-input mt-1 text-gray-800 w-full"
                    />
                    <button type="button" onClick={() => remove(index)}>
                      DELETE
                    </button>
                  </section>
                </div>
              );
            })}
            <div>
              <input
                type="button"
                value="Add more options"
                onClick={() => append({ text: "Another Option" })}
              />
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
