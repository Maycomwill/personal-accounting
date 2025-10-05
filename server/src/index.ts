import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import authRoutes from "./routes/auth/index.js";
import categoriesRoutes from "./routes/categories.js";
import incomingsRoutes from "./routes/incomings.js";
import expensesRoutes from "./routes/expenses.js";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
  origin: "*",
});

app.get("/", function (_, reply) {
  reply.send({ hello: "world" });
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Personal Accounting API",
      description: "API para o projeto Personal Accounting",
      version: "0.1.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/v1/docs",
});

app.register(authRoutes, { prefix: "/v1/auth" });
app.register(categoriesRoutes, { prefix: "/v1/category" });
app.register(incomingsRoutes, { prefix: "/v1/incoming" });
app.register(expensesRoutes, { prefix: "/v1/expense" });

app.listen({ port: 4000, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log("Server is running on port 4000");
});
