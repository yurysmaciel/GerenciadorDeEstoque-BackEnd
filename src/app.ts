import express from "express"
import { categoriaRoutes } from "./routes/categoria.routes";
import { fornecedorRoutes } from "./routes/fornecedor.routes";
import { produtoRoutes } from "./routes/produto.routes";

export const app = express();

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/categorias", categoriaRoutes);
app.use("/api/fornecedores", fornecedorRoutes);
app.use("/api/produtos", produtoRoutes);
