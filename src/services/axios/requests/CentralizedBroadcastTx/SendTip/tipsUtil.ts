import {Coin} from '@cosmjs/stargate';

const NumberToPlainCoin = (amount: number, denom: string) => {
  return {
    denom,
    amount: (amount * 1000000).toString(),
  } as Coin;
};

export default NumberToPlainCoin;
