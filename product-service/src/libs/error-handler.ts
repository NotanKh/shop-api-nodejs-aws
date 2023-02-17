const ERROR_TYPES = {
  BaseError: 'BaseError',
};

export class BaseError extends Error {
  public name;

  public code;

  constructor(error, code) {
    super(error.message || error);
    this.name = ERROR_TYPES.BaseError;
    this.code = code;
    if (error.stack) {
      this.stack = error.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const handleError = (error, logger): void => {
  if (error.name === ERROR_TYPES.BaseError) {
    throw error;
  }
  logger.error(error);

  throw new BaseError(error, { code: 0 });
};
