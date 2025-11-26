import type { AxiosError } from "axios";

export type ValidationErrors = Record<string, string[]>;

export interface ValidationProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  traceId?: string;
  errors?: ValidationErrors;
}

function camelize(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

export function getValidationErrors(error: unknown): ValidationProblemDetails | null {
  const axiosError = error as AxiosError;
  if (!axiosError.response) return null;

  if (axiosError.response.status === 400 &&
    axiosError.response.data &&
    typeof axiosError.response.data === "object"
  ) {
    const data = axiosError.response.data as ValidationProblemDetails;
    if (data.errors) {
      const camelizedErrors: ValidationErrors = {};
      for (const key in data.errors) {
        const camelizedKey = camelize(key);
        camelizedErrors[camelizedKey] = data.errors[key];
      }
      data.errors = camelizedErrors;
      return data;
    }
  }

  return null;
}
