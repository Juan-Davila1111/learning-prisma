import { t } from "elysia";

export const CreateUserSchema = t.Object({
  email: t.String({
    format: "email",
    error: "Email inválido",
  }),
  name: t.String({
    minLength: 2,
    error: "El nombre debe de tener al menos 2 caracteres",
  }),
  password: t.String({
    minLength: 8,
    error: "La contraseña debe de tener mínimo 8 caracteres",
  }),
});

export const UpdateUserSchema = t.Partial(
  t.Object({
    email: t.String({
      format: "email",
    }),
    name: t.String({
      minLength: 2,
    }),
    password: t.String({
      minLength: 8,
    }),
  })
);