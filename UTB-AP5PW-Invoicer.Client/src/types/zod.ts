import type { ZodError } from "zod";
import type { ValidationErrors } from "@/types/api.ts";

export function getZodFieldErrors(zodError: ZodError<any>): ValidationErrors {
  const zodFieldErrors: Record<string, string[]> = {};
  for (const issue of zodError.issues) {
    const field = issue.path[0]?.toString() ?? "form";
    if (!zodFieldErrors[field]) zodFieldErrors[field] = [];
    zodFieldErrors[field].push(issue.message);
  }
  return zodFieldErrors;
}
