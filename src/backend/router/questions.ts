import { z } from "zod";

import { createRouter } from "./context";
import { prisma } from "../../db/client";
import { createQuestionValidator } from "../../shared/create-question-validator";

export const questionRouter = createRouter()
  .query("get-all-my-questions", {
    async resolve({ ctx }) {
      if (!ctx.token) return [];

      return await prisma.pollQuestion.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
      });
    },
  })
  .query("get-by-id", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const question = await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });

      return {
        question,
        isOwner: question?.ownerToken === ctx.token,
      };
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ ctx, input }) {
      if (!ctx.token) throw new Error("Unauthorized");
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.token,
        },
      });
    },
  });
