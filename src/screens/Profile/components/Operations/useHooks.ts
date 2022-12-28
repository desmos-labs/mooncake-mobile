import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import {useMemo} from 'react';
import {useRecoilValue} from 'recoil';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';

const useHooks = (address: string) => {
  const {currentChain} = useRecoilValue(appSettingsState);

  const {data: balanceData, loading: balanceLoading} = useQuery(
    GetAccountBalance,
    {
      variables: {
        address,
        tokenName: currentChain.stakeCurrency.coinDenom,
      },
    },
  );

  const {data, error} = useQuery(GetTransactionsByAddress, {
    variables: {
      address: `{${address}}`,
    },
  });

  const convertedBalance = useMemo(() => {
    let balanceToReturn;
    let tokenPrice;
    let convertedAmount;
    if (balanceData && !balanceLoading) {
      balanceToReturn = convertCoin(
        balanceData?.action_account_balance?.coins[0],
        6,
        currentChain.currencies,
      );
      tokenPrice = balanceData.token_price[0].price;
      convertedAmount = parseFloat(balanceToReturn?.amount!) * tokenPrice;
    }
    return {
      balance: balanceToReturn,
      tokenPrice,
      convertedAmount,
    };
  }, [balanceData, balanceLoading, currentChain]);

  const operationsData = useMemo(() => {
    if (!data) {
      return [];
    }
    return [];
  }, [data, error]);

  return {
    operationsData,
    convertedBalance,
  };
};

export default useHooks;
