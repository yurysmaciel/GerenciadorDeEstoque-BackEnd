import { Request, Response } from "express";
import { movimentacaoService } from "../services/movimentacao.service";
import {
  criarMovimentacaoSchema,
  listarMovimentacoesQuerySchema,
} from "../types/movimentacao.schema";

export const movimentacaoController = {
  async listar(req: Request, res: Response) {
    const { produtoId } = listarMovimentacoesQuerySchema.parse(req.query);
    const movimentacoes = await movimentacaoService.listar(produtoId);
    res.json(movimentacoes);
  },

  async registrar(req: Request, res: Response) {
    const data = criarMovimentacaoSchema.parse(req.body);
    const movimentacao = await movimentacaoService.registrar(data);
    res.status(201).json(movimentacao);
  },
};