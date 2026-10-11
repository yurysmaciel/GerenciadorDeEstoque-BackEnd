import { z } from "zod";

export const criarFornecedorSchema = z.object({
    nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    cnpj: z.string().optional(),
    email: z.email("Email invàlido").optional(),
    telefone: z.string().optional(),
});

export const atualizarFornecedorSchema = criarFornecedorSchema.partial();
