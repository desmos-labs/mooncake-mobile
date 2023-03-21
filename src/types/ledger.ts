// Since we don't want to split this file into multiple files we are suppressing the eslint rule
// eslint-disable-next-line max-classes-per-file
import { ImageSourcePropType } from 'react-native';
import { HdPath } from '@cosmjs/crypto';

export type Subscription = {
  unsubscribe: () => void;
};

/**
 * Type that represents a Bluetooth Low Energy Ledger device.
 */
export type BLELedger = {
  id: string;
  name: string;
};

/**
 * Type that represents an application that can be installed on a Ledger device.
 */
export type LedgerApp = {
  /**
   * Ledger application name.
   */
  readonly name: string;
  /**
   * Application icon to be displayed to the user.
   */
  readonly icon: ImageSourcePropType;
  /**
   * Name to be displayed to the user.
   */
  readonly uiName: string;
  /**
   * Min ledger application version.
   */
  readonly minVersion: string;
  /**
   * hd path to use with this application to derive
   * the user's private key
   */
  readonly masterHdPath: HdPath;
};

/**
 * Enum that contains the possible Ledger error types.
 */
export enum LedgerErrorType {
  ConnectionFailed = 'ConnectionFailedError',
  NoApplicationOpened = 'NoApplicationOpenedError',
  WrongApplication = 'WrongApplicationError',
  DeviceDisconnected = 'DeviceDisconnectedError',
  Unknown = 'UnknownError',
}

/**
 * Error that represents a failed connection attempt.
 */
export class ConnectionFailedError extends Error {
  public deviceMac: string;

  constructor(deviceMac: string) {
    super(`Connection with ${deviceMac} failed.`);
    this.deviceMac = deviceMac;
    this.name = LedgerErrorType.ConnectionFailed;
  }
}

/**
 * Error that tells that the expected application is not open and the
 * device is in the home screen.
 */
export class NoApplicationOpenedError extends Error {
  public expectedAppName: string;

  constructor(expectedAppName: string) {
    super(`Please open the ${expectedAppName} app on your Ledger device.`);
    this.name = LedgerErrorType.NoApplicationOpened;
    this.expectedAppName = expectedAppName;
  }
}

/**
 * Error that tells that the expected application is not open and there
 * is another application open instead.
 */
export class WrongApplicationError extends Error {
  public currentAppName: string;

  public expectedAppName: string;

  constructor(expectedAppName: string, currentAppName: string) {
    super(`Please close ${currentAppName} and open ${expectedAppName} on your Ledger device.`);
    this.name = LedgerErrorType.WrongApplication;
    this.currentAppName = currentAppName;
    this.expectedAppName = expectedAppName;
  }
}

/**
 * Error that tells that the device has been disconnected while performing an
 * operation.
 */
export class DeviceDisconnectedError extends Error {
  constructor() {
    super('Device disconnected.');
    this.name = LedgerErrorType.DeviceDisconnected;
  }
}

/**
 * Unknown Ledger error.
 */
export class UnknownLedgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = LedgerErrorType.Unknown;
  }
}

export type LedgerError =
  | NoApplicationOpenedError
  | WrongApplicationError
  | DeviceDisconnectedError
  | UnknownLedgerError;
