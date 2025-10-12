import z, { ZodError } from "zod";
import type { FastifyTypeInstance } from "../types.js";
import db from "../db/client.js";
import verify_token from "../utils/verify.js";

export default async function incomingsRoutes(app: FastifyTypeInstance) {
  app.post(
    "/create",
    {
      schema: {
        tags: ["Incomings"],
        description: "Criar uma nova entrada",
        body: z.object({
          amount: z.number(),
          categoryId: z.cuid(),
          token: z.jwt(),
          name: z.string(),
          createdAt: z.iso.datetime(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            data: z.object({
              id: z.cuid(),
              amount: z.number(),
              userId: z.cuid(),
              categoryId: z.cuid(),
              createdAt: z.iso.datetime(),
              updatedAt: z.iso.datetime(),
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
        const { amount, name, categoryId, token, createdAt } = req.body;
        const verified_token = await verify_token(token);
        if (verified_token.valid === false)
          return res.code(400).send({ message: "Token inválido", data: null });

        const category = await db.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          return res.code(400).send({
            message: "Usuário ou categoria não encontrado",
            data: null,
          });
        }

        const incoming = await db.incoming.create({
          data: {
            amount,
            name,
            userId: verified_token.user!.id,
            categoryId,
            createdAt,
          },
        });
        return res.code(201).send({
          message: "Entrada criada com sucesso",
          data: {
            ...incoming,
            createdAt: incoming.createdAt.toISOString(),
            updatedAt: incoming.updatedAt.toISOString(),
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
        tags: ["Incomings"],
        description: "Deletar uma entrada por ID",
        params: z.object({ id: z.cuid() }),
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
        const incoming = await db.incoming.findUnique({
          where: { id },
        });
        if (!incoming) {
          return res.code(400).send({
            message: "Entrada não encontrada",
            data: null,
          });
        }
        await db.incoming.delete({
          where: { id },
        });
        return res
          .code(200)
          .send({ message: "Entrada deletada com sucesso", data: null });
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
        tags: ["Incomings"],
        description: "Listar todas as entradas de um usuário",
        params: z.object({ userId: z.cuid() }),
        response: {
          200: z.object({
            message: z.string(),
            data: z.array(
              z.object({
                id: z.cuid(),
                name: z.string(),
                amount: z.number(),
                userId: z.cuid(),
                categoryId: z.cuid(),
                createdAt: z.iso.datetime(),
                updatedAt: z.iso.datetime(),
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
        const user = await db.user.findUnique({
          where: { id: userId },
        });
        if (!user) {
          return res.code(400).send({
            message: "Usuário não encontrado",
            data: null,
          });
        }
        const incomings = await db.incoming.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });
        return res.code(200).send({
          message: "Entradas listadas com sucesso",
          data: incomings.map((incoming) => ({
            ...incoming,
            createdAt: incoming.createdAt.toISOString(),
            updatedAt: incoming.updatedAt.toISOString(),
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
