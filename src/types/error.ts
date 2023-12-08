/**
 * Error that represents a post that has already been reported.
 */
// Since we don't want to split this file into multiple files we are suppressing the eslint rule
// eslint-disable-next-line max-classes-per-file
export class PostAlreadyReportedError extends Error {
  readonly type: 'PostAlreadyReportedError';

  constructor(message?: string) {
    super(message || 'Post already reported');
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
    super(message || 'Operation canceled');
    this.type = 'CanceledOperationError';
  }
}

export class CanceledBlockError extends Error {
  readonly type: 'CanceledBlockError';

  constructor() {
    super('User aborted cancel flow.');
    this.type = 'CanceledBlockError';
  }
}
