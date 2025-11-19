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

export function getValidationErrors(error: unknown): ValidationProblemDetails | null {
  const axiosError = error as AxiosError;
  if (!axiosError.response) return null;

  if (axiosError.response.status === 400 &&
    axiosError.response.data &&
    typeof axiosError.response.data === "object"
  ) {
    const data = axiosError.response.data as ValidationProblemDetails;
    if (data.errors) {
      return data;
    }
  }

  return null;
}
