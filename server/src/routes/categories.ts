import z, { ZodError } from "zod";
import type { FastifyTypeInstance } from "../types.js";
import db from "../db/client.js";
import { create } from "domain";

export default async function categoriesRoutes(app: FastifyTypeInstance) {
  app.post(
    "/create",
    {
      schema: {
        tags: ["Categories"],
        description: "Cria uma nova categoria",
        body: z.object({
          name: z.string().min(3).max(30),
        }),
        response: {
          201: z.object({
            message: z.string(),
            data: z.object({
              id: z.cuid(),
              name: z.string(),
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
        const { name } = req.body;
        const existingCategory = await db.category.findFirst({
          where: { name },
        });
        if (existingCategory) {
          return res.code(400).send({
            message: "Categoria já existe",
            data: null,
          });
        }
        const category = await db.category.create({
          data: {
            name,
          },
        });
        return res.code(201).send({
          message: "Categoria criada com sucesso",
          data: category,
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
        tags: ["Categories"],
        description: "Deleta uma categoria",
        params: z.object({
          id: z.string().cuid(),
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
        const category = await db.category.findUnique({
          where: { id },
        });
        if (!category) {
          return res.code(400).send({
            message: "Categoria não encontrada",
            data: null,
          });
        }
        await db.category.delete({
          where: { id },
        });
        return res.code(200).send({
          message: "Categoria deletada com sucesso",
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
    "/list",
    {
      schema: {
        tags: ["Categories"],
        description: "Lista todas as categorias",
        response: {
          200: z.object({
            message: z.string(),
            data: z.array(
              z.object({
                id: z.cuid(),
                name: z.string(),
                createdAt: z.iso.datetime(),
                updatedAt: z.iso.datetime(),
                expenses: z.array(
                  z.object({
                    id: z.string(),
                    amount: z.number(),
                    userId: z.string(),
                    name: z.string(),
                    createdAt: z.iso.datetime(),
                    updatedAt: z.iso.datetime(),
                    categoryId: z.string(),
                  })
                ),
                incomings: z.array(
                  z.object({
                    id: z.string(),
                    amount: z.number(),
                    userId: z.string(),
                    name: z.string(),
                    createdAt: z.iso.datetime(),
                    updatedAt: z.iso.datetime(),
                    categoryId: z.string(),
                  })
                ),
              })
            ),
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
        const categories = await db.category.findMany({
          include: {
            Expense: true,
            Incomings: true,
          },
        });
        return res.code(200).send({
          message: "Categorias listadas com sucesso",
          data: categories.map((category) => ({
            ...category,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
            expenses: category.Expense.map((expense) => ({
              ...expense,
              createdAt: expense.createdAt.toISOString(),
              updatedAt: expense.updatedAt.toISOString(),
            })),
            incomings: category.Incomings.map((incoming) => ({
              ...incoming,
              createdAt: incoming.createdAt.toISOString(),
              updatedAt: incoming.updatedAt.toISOString(),
            })),
          })),
        });
      } catch (error) {
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
    "/:id",
    {
      schema: {
        tags: ["Categories"],
        description: "Busca uma categoria",
        params: z.object({
          id: z.string().cuid(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            data: z.object({
              id: z.cuid(),
              name: z.string(),
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
        const { id } = req.params;
        const category = await db.category.findUnique({
          where: { id },
        });
        if (!category) {
          return res.code(400).send({
            message: "Categoria não encontrada",
            data: null,
          });
        }
        return res.code(200).send({
          message: "Categoria encontrada com sucesso",
          data: category,
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
