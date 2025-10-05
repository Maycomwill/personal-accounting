import z, { ZodError } from "zod";
import type { FastifyTypeInstance } from "../types.js";
import db from "../db/client.js";

export default async function expensesRoutes(app: FastifyTypeInstance) {
  app.post(
    "/create",
    {
      schema: {
        tags: ["Expenses"],
        description: "Criar uma nova despesa",
        body: z.object({
          amount: z.number().negative(),
          categoryId: z.cuid(),
          userId: z.cuid(),
          name: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            data: z.object({
              id: z.cuid(),
              amount: z.number().negative(),
              userId: z.cuid(),
              name: z.string(),
              categoryId: z.cuid(),
              createdAt: z.iso.datetime(),
              updatedAt: z.iso.datetime(),
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
        const { amount, name, categoryId, userId } = req.body;
        const category = await db.category.findUnique({
          where: { id: categoryId },
        });
        const user = await db.user.findUnique({
          where: { id: userId },
        });
        if (!user || !category) {
          return res.code(400).send({
            message: "Usuário ou categoria não encontrado",
            data: null,
          });
        }
        const expense = await db.expense.create({
          data: {
            amount,
            name,
            userId,
            categoryId,
          },
        });
        return res.code(201).send({
          message: "Despesa criada com sucesso",
          data: {
            ...expense,
            createdAt: expense.createdAt.toISOString(),
            updatedAt: expense.updatedAt.toISOString(),
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

  app.delete(
    "/delete/:id",
    {
      schema: {
        tags: ["Expenses"],
        description: "Deletar uma despesa",
        params: z.object({
          id: z.cuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            data: z.null(),
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
        const { id } = req.params;
        const expense = await db.expense.findUnique({
          where: { id },
        });
        if (!expense) {
          return res.code(400).send({
            message: "Despesa não encontrada",
            data: null,
          });
        }
        await db.expense.delete({
          where: { id },
        });
        return res.code(200).send({
          message: "Despesa deletada com sucesso",
          data: null,
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

  app.get(
    "/list/:userId",
    {
      schema: {
        tags: ["Expenses"],
        description: "Listar todas as despesas de um usuário",
        params: z.object({
          userId: z.cuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            data: z.array(
              z.object({
                id: z.cuid(),
                amount: z.number().negative(),
                userId: z.cuid(),
                categoryId: z.cuid(),
                createdAt: z.iso.datetime(),
                updatedAt: z.iso.datetime(),
                name: z.string(),
              })
            ),
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
        const { userId } = req.params;
        const expenses = await db.expense.findMany({
          where: { userId },
        });
        return res.code(200).send({
          message: "Despesas listadas com sucesso",
          data: expenses.map((expense) => ({
            ...expense,
            createdAt: expense.createdAt.toISOString(),
            updatedAt: expense.updatedAt.toISOString(),
          })),
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
