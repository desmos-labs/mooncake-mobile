// eslint-disable-next-line max-classes-per-file
export enum SecureStorageErrorType {
  CorruptedData,
  WrongPassword,
  WalletNotFound,
  InvalidPassword,
  Unknown,
}

/**
 * Secure storage error raised if the provided password
 * used to decrypt the data is invalid.
 */
export class WrongPasswordError extends Error {
  readonly type: SecureStorageErrorType.WrongPassword;

  constructor(message?: string) {
    super(message);
    this.type = SecureStorageErrorType.WrongPassword;
  }
}

/**
 * Secure storage error raised if the data present in the
 * storage is corrupted.
 */
export class CorruptedDataError extends Error {
  readonly type: SecureStorageErrorType.CorruptedData;

  constructor(message?: string) {
    super(message);
    this.type = SecureStorageErrorType.CorruptedData;
  }
}

export class WalletNotFoundError extends Error {
  readonly type: SecureStorageErrorType.WalletNotFound;

  readonly address: string;

  constructor(address: string) {
    super(`Wallet with address ${address} not found`);
    this.address = address;
    this.type = SecureStorageErrorType.WalletNotFound;
  }
}

/**
 * Secure storage error raised if the provided password is invalid.
 */
export class InvalidPasswordError extends Error {
  readonly type: SecureStorageErrorType.InvalidPassword;

  constructor() {
    super();
    this.type = SecureStorageErrorType.InvalidPassword;
  }
}

/**
 * Secure storage error raised if we can't provide
 * details about the error cause.
 */
export class UnknownError extends Error {
  readonly type: SecureStorageErrorType.Unknown;

  constructor(message: string) {
    super(message);
    this.type = SecureStorageErrorType.Unknown;
  }
}

/**
 * Type union that represents the possible errors that can be
 * raised from the SecureStorage.
 */
export type SecureStorageError =
  | WrongPasswordError
  | CorruptedDataError
  | WalletNotFoundError
  | InvalidPasswordError
  | UnknownError;
