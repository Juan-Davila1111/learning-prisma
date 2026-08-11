import { Elysia } from "elysia";
import { prisma } from "../../db/prisma";
import { CreateUserSchema, UpdateUserSchema } from "./schemas";
import { PrismaClientKnownRequestError } from "../../../prisma/generated/prisma/internal/prismaNamespace";

export const userRoutes = new Elysia({
  prefix: "/users",
});

userRoutes.get("/", async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });

  const usersWithDataFormatted = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString().replace("Z", "").replace("T", " "),
    updatedAt: user.updatedAt.toISOString().replace("Z", "").replace("T", " ")
  }));

  return new Response(JSON.stringify({ ok: true, data: usersWithDataFormatted }), {
    status: 200,
  });
});

userRoutes.get("/:id", async ({ params, set }) => {
  const { id } = params;

  // Validar que venga el id
  if (!id) {
    set.status = 400;

    return {
      ok: false,
      message: "El id del usuario es requerido",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      set.status = 404;

      return {
        ok: false,
        message: "Usuario no encontrado",
      };
    }

    set.status = 200;

    return {
      ok: true,
      data: user,
    };
  } catch (error) {
    set.status = 500;

    return {
      ok: false,
      message: "Error interno del servidor",
    };
  }
});

userRoutes.post(
  "/",
  async ({ body }) => {
    const hashedPassword = await Bun.password.hash(body.password);
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword,
        },
        omit: {
          password: true,
        },
      });

      return new Response(JSON.stringify({ ok: true, data: user }), {
        status: 201,
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
        return new Response(
          JSON.stringify({ ok: false, message: "User existente." }),
          { status: 409 },
        );
      }
    }
  },
  {
    body: CreateUserSchema,
  },
);

userRoutes.patch(
  "/:id",
  async ({ params, set, body }) => {
    const id = params.id;

    if (!id) {
      set.status = 400;
      return {
        ok: false,
        message: "Id no proporcionado",
      };
    }

    const data = {
      ...body,
      ...(body.password !== undefined && {
        password: await Bun.password.hash(body.password),
      }),
    };
    try {
      const user = await prisma.user.update({
        where: { id },
        data,
        omit: {
          password: true,
        },
      });

      set.status = 200;
      return {
        ok: true,
        user,
      };
    } catch (e) {
      set.status = 404;

      return {
        ok: false,
        message: "User not exist",
      };
    }
  },
  {
    body: UpdateUserSchema,
  },
);

userRoutes.delete("/:id", async ({ params, set }) => {
  const id = params.id;

  if (!id) {
    set.status = 400;
    return {
      ok: false,
      message: "Id no proporcionado",
    };
  }
  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    if (!user) {
      set.status = 404;
      return {
        ok: false,
        message: "Usuario no existente",
      };
    }

    set.status = 204;
    return {
      ok: true,
      message: "Usuario eliminado exitosamente",
    };
  } catch (e) {
    console.log("[Error] ", e);

    set.status = 500;
    return {
      ok: false,
      message: "Error interno del servidor",
    };
  }
});
