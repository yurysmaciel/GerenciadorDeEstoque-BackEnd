import { Router } from "express";
import { fornecedorController } from "../controllers/fornecedor.controller";

export const fornecedorRoutes = Router();

fornecedorRoutes.get("/", fornecedorController.listar);
fornecedorRoutes.get("/:id", fornecedorController.buscarPorId);
fornecedorRoutes.post("/", fornecedorController.criar);
fornecedorRoutes.put("/:id", fornecedorController.atualizar);
fornecedorRoutes.delete("/:id", fornecedorController.remover);
