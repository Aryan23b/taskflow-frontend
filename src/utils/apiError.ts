import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {

  if (axios.isAxiosError(error)) {

    const responseData =
      error.response?.data;

    if (
      responseData &&
      typeof responseData === "object" &&
      "message" in responseData &&
      typeof responseData.message === "string"
    ) {
      return responseData.message;
    }

    if (
      responseData &&
      typeof responseData === "object" &&
      "error" in responseData &&
      typeof responseData.error === "string"
    ) {
      return responseData.error;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}