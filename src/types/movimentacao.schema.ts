import { z } from "zod";

export const criarMovimentacaoSchema = z.object({
    produtoId: z.uuid("produtoId inválido"),
    tipo: z.enum(["ENTRADA", "SAIDA"]),
    quantidade: z.number().int().positive("Quantidade deve ser maior que zero"),
    motivo: z.string().optional(),
});

export const listarMovimentacoesQuerySchema = z.object({
    produtoId: z.uuid().optional(),
});
