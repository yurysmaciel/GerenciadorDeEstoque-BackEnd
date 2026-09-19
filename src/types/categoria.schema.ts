import { z } from "zod";

export const criarCategoriaSchema = z.object({
    nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
    descricao: z.string().optional(),
});

export const atualizarCategoriaSchema = criarCategoriaSchema.partial();
