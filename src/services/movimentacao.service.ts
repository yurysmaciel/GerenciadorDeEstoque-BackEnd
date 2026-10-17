import { prisma } from "../config/prisma";
import { AppError } from "../utils/AppError";

type RegistrarInput = {
  produtoId: string;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  motivo?: string;
};

export const movimentacaoService = {
  listar(produtoId?: string) {
    return prisma.movimentacao.findMany({
      where: produtoId ? { produtoId } : undefined,
      include: { produto: true },
      orderBy: { createdAt: "desc" },
    });
  },

  registrar(data: RegistrarInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Atualiza a quantidade do produto
      const resultado = await tx.produto.updateMany({
        where: {
          id: data.produtoId,
          // Em saídas, só atualiza se houver estoque suficiente
          ...(data.tipo === "SAIDA" && { quantidade: { gte: data.quantidade } }),
        },
        data: {
          quantidade:
            data.tipo === "ENTRADA"
              ? { increment: data.quantidade }
              : { decrement: data.quantidade },
        },
      });

      // 2. Nenhuma linha atualizada: produto não existe ou estoque insuficiente
      if (resultado.count === 0) {
        const produto = await tx.produto.findUnique({
          where: { id: data.produtoId },
          select: { quantidade: true },
        });

        if (!produto) {
          throw new AppError("Produto não encontrado", 404);
        }

        throw new AppError(
          `Estoque insuficiente. Disponível: ${produto.quantidade}`,
          400
        );
      }

      // 3. Registra a movimentação no histórico
      return tx.movimentacao.create({
        data,
        include: { produto: true },
      });
    });
  },
};