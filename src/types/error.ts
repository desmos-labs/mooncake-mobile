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
