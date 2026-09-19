import { prisma } from "../config/prisma";

export const categoriaService = {
  listar() {
    return prisma.categoria.findMany({ orderBy: { nome: "asc" } });
  },

  buscarPorId(id: string) {
    return prisma.categoria.findUnique({ where: { id } });
  },

  criar(data: { nome: string; descricao?: string }) {
    return prisma.categoria.create({ data });
  },

  atualizar(id: string, data: { nome?: string; descricao?: string }) {
    return prisma.categoria.update({ where: { id }, data });
  },

  remover(id: string) {
    return prisma.categoria.delete({ where: { id } });
  },
};