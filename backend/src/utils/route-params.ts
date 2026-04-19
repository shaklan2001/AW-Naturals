import { HttpError } from "../middleware/error-handler.js";

export function mustParam(value: string | string[] | undefined, name: string): string {
  const v = Array.isArray(value) ? value[0] : value;
  if (v == null || v === "") throw new HttpError(400, `Missing or invalid ${name}`);
  return v;
}
