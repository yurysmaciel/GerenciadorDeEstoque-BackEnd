import { Request, Response } from "express";
import { produtoService } from "../services/produto.service";
import {
  atualizarProdutoSchema,
  criarProdutoSchema,
} from "../types/produto.schema";

type ParamsId = { id: string };

export const produtoController = {
  async listar(_req: Request, res: Response) {
    const produtos = await produtoService.listar();
    res.json(produtos);
  },

  async buscarPorId(req: Request<ParamsId>, res: Response) {
    const produto = await produtoService.buscarPorId(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json(produto);
  },

  async criar(req: Request, res: Response) {
    const data = criarProdutoSchema.parse(req.body);
    const produto = await produtoService.criar(data);
    res.status(201).json(produto);
  },

  async atualizar(req: Request<ParamsId>, res: Response) {
    const data = atualizarProdutoSchema.parse(req.body);
    const produto = await produtoService.atualizar(req.params.id, data);
    res.json(produto);
  },

  async remover(req: Request<ParamsId>, res: Response) {
    await produtoService.remover(req.params.id);
    res.status(204).send();
  },
};