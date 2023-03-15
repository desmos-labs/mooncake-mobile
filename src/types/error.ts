/**
 * Error that represents a post that has already been reported.
 */
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
