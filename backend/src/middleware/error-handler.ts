import type { NextFunction, Request, Response } from "express";
import type { MulterError } from "multer";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.details != null ? { details: err.details } : {}),
    });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", details: err.flatten() });
    return;
  }
  const multerErr = err as MulterError | undefined;
  if (multerErr && typeof multerErr === "object" && "code" in multerErr) {
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File is too large for the configured upload limit." });
      return;
    }
    if (multerErr.code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({ error: 'Use form field name "file" for the image.' });
      return;
    }
  }
  const message = err instanceof Error ? err.message : "Internal server error";
  console.error(err);
  res.status(500).json({ error: message });
}

export function notFoundHandler(req: Request, res: Response): void {
  const path = (req.originalUrl ?? req.url ?? req.path).split("?")[0] || req.path;
  const payload: { error: string; hint?: string } = {
    error: `Not found: ${req.method} ${path}`,
  };
  if (path.includes("/auth/") && process.env.NODE_ENV !== "production") {
    payload.hint =
      "If you use `npm start`, the server runs compiled `dist/`. Run `cd backend && npm run build` (or use `npm run dev`) so `/auth/*` routes exist, then restart.";
  }
  res.status(404).json(payload);
}
