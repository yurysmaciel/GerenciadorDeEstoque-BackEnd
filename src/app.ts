import express from "express"
import { categoriaRoutes } from "./routes/categoria.routes";

export const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categorias", categoriaRoutes);
