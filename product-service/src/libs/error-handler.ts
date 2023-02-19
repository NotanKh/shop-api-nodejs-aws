import { ErrorCodes } from '@libs/constants';

const ERROR_TYPES = {
  BaseError: 'BaseError',
};

export class BaseError extends Error {
  name: string;

  code: number;

  constructor(error, { code }) {
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

export const handleError = (error, logger, code = ErrorCodes.UNKNOWN): BaseError => {
  if (error.name === ERROR_TYPES.BaseError) {
    return error;
  }
  logger.error(error);

  return new BaseError(error, { code });
};
