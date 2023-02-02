import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { calculateFee } from '@cosmjs/stargate';
import { GenericMsgEnums } from './msgtypes';

/**
 * @deprecated
 * Interface that represents the various level
 * of the gas prices.
 */
export interface GasPrices {
  readonly low: string;
  readonly average: string;
  readonly high: string;
}

/**
 * @deprecated
 * Default desmos gas prices.
 * The price are without denom since it depends on the chain selected from the user.
 */
export const DefaultGasPrice: GasPrices = {
  low: '0.005',
  average: '0.01',
  high: '0.03',
};

/**
 * @deprecated
 * Tx price levels.
 */
export type TxPriceLevel = keyof TxFees;

/**
 * @deprecated
 * Interface that represents the various level
 * of fees that can be paid for a transaction.
 */
export interface TxFees {
  readonly low: StdFee;
  readonly average: StdFee;
  readonly high: StdFee;
}

/**
 * @deprecated
 * Computes the tx fees for
 * @param gas - The tx gas.
 * @param denom - The chain coin denom.
 * @param prices - Optional gas price levels.
 */
export function computeTxFees(gas: number, denom: string, prices?: GasPrices): TxFees {
  const gasPrices = prices ?? DefaultGasPrice;
  return {
    low: calculateFee(gas, `${gasPrices.low}${denom}`),
    average: calculateFee(gas, `${gasPrices.average}${denom}`),
    high: calculateFee(gas, `${gasPrices.high}${denom}`),
  };
}

/**
 * @deprecated
 * Estimates the total gas needed to process the provided messages.
 * @param msg - List of messages.
 */
export function messagesGas(msg: EncodeObject[]): number {
  let gas = 0;
  msg.forEach(m => {
    switch (m.typeUrl) {
      case GenericMsgEnums.MsgLinkChainAccount:
      case GenericMsgEnums.MsgUnlinkChainAccount:
      case GenericMsgEnums.MsgSaveProfile:
        gas += 200000;
        break;

      case GenericMsgEnums.MsgSend:
        gas += 140000;
        break;

      default:
        gas += 140000;
        break;
    }
  });

  return gas;
}

/**
 * @deprecated
 * Convenience function that returns an object containing the Gas and txFees
 */
export const computeGasAndFees = ({
  msg,
  denom,
}: {
  msg: EncodeObject[];
  denom: string;
}): {
  gas: number;
  fee: TxFees;
} => {
  const gas = messagesGas(msg);

  return {
    gas,
    fee: computeTxFees(gas, denom),
  };
};
