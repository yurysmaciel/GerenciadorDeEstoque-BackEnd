import { Router } from "express";
import { categoriaController } from "../controllers/categoria.controller";

export const categoriaRoutes = Router();

categoriaRoutes.get("/", categoriaController.listar);
categoriaRoutes.get("/:id", categoriaController.buscarPorId);
categoriaRoutes.post("/", categoriaController.criar);
categoriaRoutes.put("/:id", categoriaController.atualizar);
categoriaRoutes.delete("/:id", categoriaController.remover);
