import { z } from "zod";

export const criarProdutoSchema = z.object({
    nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    descricao: z.string().optional(),
    sku: z.string().min(1, "Codigo do produto é obrigatório"),
    precoCusto: z.number().nonnegative(),
    precoVenda: z.number().nonnegative(),
    quantidade: z.number().int().nonnegative().default(0),
    quantidadeMin: z.number().int().nonnegative().default(0),
    cartegoriaId: z.uuid().optional(),
    fornecedorId: z.uuid().optional(),
});

export const atualizarProdutoSchema = criarProdutoSchema.partial();
