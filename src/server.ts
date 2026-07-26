import "dotenv/config";
import { Elysia } from "elysia";
import { userRoutes } from "./modules/users/routes";

const port = Number(process.env.PORT ?? 3000);

const app = new Elysia();
app.use(userRoutes);

app.listen(port, () => {
  console.log(`Elysia is running on http://localhost:${port}`);
});
