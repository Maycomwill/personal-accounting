import z, { ZodError } from "zod";
import type { FastifyTypeInstance } from "../types.js";
import verify_token from "../utils/verify.js";
import db from "../db/client.js";

export default async function transactionsRoutes(app: FastifyTypeInstance) {
  app.get(
    "/monthly-list",
    {
      schema: {
        tags: ["Transactions"],
        description: "Listagem de transações no mês",
        querystring: z.object({
          month: z.coerce.number().min(1).max(12),
          year: z.coerce.number().min(1900).positive(),
          token: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            data: z.object({
              userId: z.cuid(),
              period: z.object({
                month: z.number(),
                year: z.number(),
              }),
              transactions: z.object({
                expenses: z.array(
                  z.object({
                    id: z.cuid(),
                    amount: z.number(),
                    userId: z.cuid(),
                    categoryId: z.cuid(),
                    createdAt: z.iso.datetime(),
                    updatedAt: z.iso.datetime(),
                    name: z.string(),
                  })
                ),
                incomings: z.array(
                  z.object({
                    id: z.cuid(),
                    amount: z.number(),
                    userId: z.cuid(),
                    categoryId: z.cuid(),
                    createdAt: z.iso.datetime(),
                    updatedAt: z.iso.datetime(),
                    name: z.string(),
                  })
                ),
              }),
            }),
          }),
          400: z.object({
            message: z.string(),
            data: z.null(),
          }),
          500: z.object({
            message: z.string(),
            data: z.null(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const { token, month, year } = req.query;

        const verified_token = await verify_token(token);
        if (verified_token.valid === false || !verified_token.user) {
          return res.code(400).send({ message: "Token inválido", data: null });
        }
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const expenses = await db.expense.findMany({
          where: {
            userId: verified_token.user.id,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        const incomings = await db.incoming.findMany({
          where: {
            userId: verified_token.user.id,
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        return res.code(200).send({
          message: "Sucesso",
          data: {
            userId: verified_token.user.id,
            period: {
              month,
              year,
            },
            transactions: {
              expenses: expenses.map((expense) => {
                return {
                  ...expense,
                  createdAt: expense.createdAt.toISOString(),
                  updatedAt: expense.updatedAt.toISOString(),
                };
              }),
              incomings: incomings.map((incoming) => {
                return {
                  ...incoming,
                  createdAt: incoming.createdAt.toISOString(),
                  updatedAt: incoming.updatedAt.toISOString(),
                };
              }),
            },
          },
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.code(400).send({
            message: "Erro de validação",
            data: null,
          });
        }
        if (error instanceof Error) {
          return res.code(500).send({
            message: error.message,
            data: null,
          });
        }
        return res.code(500).send({
          message: "Erro interno",
          data: null,
        });
      }
    }
  );
}
