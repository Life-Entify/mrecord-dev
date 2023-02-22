export interface ErrorCause<T = any> {
  code: number;
  label: React.ReactNode;
  data?: T;
}
export class AppError<T> extends Error {
  cause?: ErrorCause<T>;
  constructor(
    message: string,
    options: {
      cause?: ErrorCause<T>;
    }
  ) {
    super(message, options);
    this.message = message;
    this.cause = options.cause;
  }
}
