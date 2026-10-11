import { prisma } from "../config/prisma";

export const fornecedorService = {
    listar() {
        return prisma.fornecedor.findMany({ orderBy: { nome: "asc" } });
    },

    buscarPorId(id: string) {
        return prisma.fornecedor.findUnique({ where: { id } });
    },

    criar(data: {
        nome: string;
        cnpj?: string;
        email?: string;
        telefone?: string;
    }) {
        return prisma.fornecedor.create({ data });
    },

    atualizar(
        id: string,
        data: { 
        nome?: string;
        cnpj?: string;
        email?: string;
        telefone?: string;
    }) {
        return prisma.fornecedor.update({ where: { id }, data });
    },

    remover(id: string) {
        return prisma.fornecedor.delete({ where: { id } });
    },
};
