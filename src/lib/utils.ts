import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {ErrorResponse, HttpResponse, ImageResponse, PageResponse} from "@/types/responses.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isErrorResponse(data): data is ErrorResponse {
  return data && data.errorCode !== undefined;
}

export function isHttpResponse<T>(data): data is HttpResponse<T> {
  return data && data.responseStatusCode !== undefined;
}

export function isPageResponse<T>(data): data is PageResponse<T> {
  return data && data.pageable !== undefined;
}

export async function createFilesFromImagesResponses(responses: ImageResponse[]): Promise<File[]> {
  const filePromises = responses.map(async (response) => {
    const { url, name } = response;

    const fetchResponse = await fetch(url);

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch image at ${url}`);
    }

    const blob = await fetchResponse.blob();

    return new File([blob], name, { type: blob.type });
  });

  return Promise.all(filePromises);
}
