import { Request, Response } from "express";
import { fornecedorService } from "../services/fornecedor.service";
import {
    atualizarFornecedorSchema,
    criarFornecedorSchema,
} from "../types/fornecedor.schema";

type ParamsId = { id: string };

export const fornecedorController = {
    async listar(_req: Request, res: Response) {
        const fornecedores = await fornecedorService.listar();
        res.json(fornecedores);
    },

    async buscarPorId(req: Request<ParamsId>, res: Response) {
        const fornecedor = await fornecedorService.buscarPorId(req.params.id);
        if (!fornecedor) {
            return res.status(404).json({ error: "Fornecedor não encontrado"});
        }
        res.json(fornecedor);
    },

    async criar(req: Request, res: Response) {
        const data = criarFornecedorSchema.parse(req.body);
        const fornecedor = await fornecedorService.criar(data);
        res.status(201).json(fornecedor);
    },

    async atualizar(req: Request<ParamsId>, res: Response) {
        const data = atualizarFornecedorSchema.parse(req.body);
        const fornecedor = await fornecedorService.atualizar(req.params.id, data);
        res.json(fornecedor);
    },

    async remover(req: Request<ParamsId>, res: Response) {
        await fornecedorService.remover(req.params.id);
        res.status(204).send();
    },
};
