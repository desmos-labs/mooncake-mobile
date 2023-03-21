/**
 * Error that represents a post that has already been reported.
 */
// Since we don't want to split this file into multiple files we are suppressing the eslint rule
// eslint-disable-next-line max-classes-per-file
export class PostAlreadyReportedError extends Error {
  readonly type: 'PostAlreadyReportedError';

  constructor(message?: string) {
    super(message);
    this.type = 'PostAlreadyReportedError';
  }
}

export const isPostAlreadyReportedError = (e: Error): e is PostAlreadyReportedError => {
  const { type } = e as PostAlreadyReportedError;
  return type === 'PostAlreadyReportedError';
};

/**
 * Error that tells the user has not granted the permission to use the centralized APIs.
 */
export class CentralizedApiNotGrantedError extends Error {
  readonly type: 'CentralizedApiNotGrantedError';

  constructor(message?: string) {
    super(message);
    this.type = 'CentralizedApiNotGrantedError';
  }
}

export const isCentralizedApiNotGrantedError = (e: Error): e is CentralizedApiNotGrantedError => {
  const { type } = e as CentralizedApiNotGrantedError;
  return type === 'CentralizedApiNotGrantedError';
};

/**
 * Error that represents an operation that has been canceled from the user.
 */
export class CanceledOperationError extends Error {
  readonly type: 'CanceledOperationError';

  constructor(message?: string) {
    super(message);
    this.type = 'CanceledOperationError';
  }
}

export const isCanceledOperationError = (e: Error): e is CanceledOperationError => {
  const { type } = e as CanceledOperationError;
  return type === 'CanceledOperationError';
};
