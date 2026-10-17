import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: "Rota não encontrada" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      error: "Erro de validação",
      detalhes: err.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensagem: issue.message,
      })),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Já existe um registro com esse valor único" });
    }

    if (err.code === "P2025") {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    if (err.code === "P2003") {
      return res.status(409).json({
        error:
          "Operação inválida: o registro referenciado não existe ou ainda está em uso por outros dados",
      });
    }
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "JSON inválido no corpo da requisição" });
  }

  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
}