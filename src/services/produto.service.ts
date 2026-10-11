import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

const includeRelacoes = {
    categoria: true,
    fornecedor: true,
} satisfies Prisma.ProdutoInclude;

export const produtoService = {
    listar() {
        return prisma.produto.findMany({
            include: includeRelacoes,
            orderBy: { nome: "asc" },
        });
    },

    buscarPorId(id: string) {
        return prisma.produto.findUnique({
            where: { id },
            include: includeRelacoes,
        });
    },

    criar(data: Prisma.ProdutoUncheckedCreateInput) {
        return prisma.produto.create({ data, include: includeRelacoes } )
    },

    atualizar(id: string, data: Prisma.ProdutoUncheckedUpdateInput) {
        return prisma.produto.update({
            where: { id },
            data,
            include: includeRelacoes,
        });
    },

    remover(id: string) {
        return prisma.produto.delete({where: { id } });
    },
};
