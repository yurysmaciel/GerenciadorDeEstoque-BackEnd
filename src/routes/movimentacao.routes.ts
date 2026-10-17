import { Router } from "express";
import { movimentacaoController } from "../controllers/movimentacao.controller";

export const movimentacaoRoutes = Router();

movimentacaoRoutes.get("/", movimentacaoController.listar);
movimentacaoRoutes.post("/", movimentacaoController.registrar);
