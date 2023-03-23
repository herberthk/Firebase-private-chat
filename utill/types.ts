export interface ErrorType {
  code: number;
  message?: string;
  errors: {
    domain: string;
    message: string;
    reason: string;
  }[];
}
// interface Errors {
//   domain: string;
//   message: string;
//   reason: string;
// }
// export class CustomError {
//   constructor(error?: ErrorType) {
//     throw new Error(error);
//   }
// }
export type ErrorWithMessage = {
  message: string | null;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
};

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};
