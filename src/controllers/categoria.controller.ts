import { Request, Response } from "express";
import { categoriaService } from "../services/categoria.service";
import {
  atualizarCategoriaSchema,
  criarCategoriaSchema,
} from "../types/categoria.schema";

type ParamsId = { id: string };

export const categoriaController = {
  async listar(_req: Request, res: Response) {
    const categorias = await categoriaService.listar();
    res.json(categorias);
  },

  async buscarPorId(req: Request<ParamsId>, res: Response) {
    const categoria = await categoriaService.buscarPorId(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.json(categoria);
  },

  async criar(req: Request, res: Response) {
    const data = criarCategoriaSchema.parse(req.body);
    const categoria = await categoriaService.criar(data);
    res.status(201).json(categoria);
  },

  async atualizar(req: Request<ParamsId>, res: Response) {
    const data = atualizarCategoriaSchema.parse(req.body);
    const categoria = await categoriaService.atualizar(req.params.id, data);
    res.json(categoria);
  },

  async remover(req: Request<ParamsId>, res: Response) {
    await categoriaService.remover(req.params.id);
    res.status(204).send();
  },
};