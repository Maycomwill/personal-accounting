import { z, ZodError } from "zod";
import type { FastifyTypeInstance } from "../../types.js";
import db from "../../db/client.js";
import { compare } from "bcrypt";
import compare_passwords from "../../utils/compare.js";
import generate_token from "../../utils/generate_token.js";
import create_hash_password from "../../utils/create_hash_password.js";

export default async function authRoutes(app: FastifyTypeInstance) {
  app.post(
    "/login",
    {
      schema: {
        description: "Rota para realizar login",
        tags: ["Auth"],
        body: z.object({
          email: z.email(),
          reminder: z.boolean().default(false),
          password: z
            .string()
            .min(8, "A senha deve ter ao menos 8 caracteres")
            .max(255),
        }),
        response: {
          200: z.object({
            token: z.string(),
            data: z.object({
              id: z.cuid(),
              email: z.email(),
              createdAt: z.iso.datetime(),
              updatedAt: z.iso.datetime(),
              name: z.string(),
            }),
            message: z.string(),
          }),

          400: z.object({
            data: z.null(),
            message: z.string(),
          }),
          500: z.object({
            data: z.null(),
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        const { email, password, reminder } = req.body;
        const user = await db.user.findUnique({
          where: { email },
        });
        if (!user) {
          return res
            .status(400)
            .send({ data: null, message: "Credenciais inválidas" });
        }

        const hash = user.password;
        const verify = compare_passwords(password, hash);

        if (!verify) {
          return res
            .status(400)
            .send({ data: null, message: "Credenciais inválidas" });
        }

        const token = generate_token(reminder, user.id);
        return res.status(200).send({
          message: "Login realizado com sucesso",
          token,
          data: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            name: user.name,
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

  app.post(
    "/register",
    {
      schema: {
        description: "Rota para realizar cadastro",
        tags: ["Auth"],
        body: z.object({
          email: z.email(),
          name: z.string().min(3).max(100),
          password: z
            .string()
            .min(8, "A senha deve ter ao menos 8 caracteres")
            .max(255),
        }),
        response: {
          201: z.object({
            message: z.string(),
            data: z.object({
              id: z.cuid(),
              email: z.email(),
              createdAt: z.iso.datetime(),
              updatedAt: z.iso.datetime(),
              name: z.string(),
            }),
          }),
          400: z
            .object({
              data: z.null(),
              message: z.string(),
            })
            .describe("Erro de validação"),
          500: z
            .object({
              data: z.null(),
              message: z.string(),
            })
            .describe("Erro interno"),
        },
      },
    },
    async (req, res) => {
      try {
        const { email, name, password } = req.body;
        const userExists = await db.user.findUnique({
          where: { email },
        });
        if (userExists) {
          return res
            .status(400)
            .send({ data: null, message: "Email já cadastrado" });
        }
        const hash_password = create_hash_password(password);
        const user = await db.user.create({
          data: {
            email,
            name,
            password: hash_password,
          },
        });

        if (!user) {
          return res
            .status(500)
            .send({ data: null, message: "Erro ao criar usuário" });
        }

        return res.status(201).send({
          data: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt.toDateString(),
            updatedAt: user.updatedAt.toDateString(),
            name: user.name,
          },
          message: "Usuário criado com sucesso",
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return res.code(400).send({
            message: "Erro de validação",
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
