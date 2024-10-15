import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {ErrorResponse, HttpResponse} from "@/types/responses.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isErrorResponse(data): data is ErrorResponse {
  return data && data.errorCode !== undefined;
}

export function isHttpResponse<T>(data): data is HttpResponse<T> {
  return data && data.responseStatusCode !== undefined;
}
