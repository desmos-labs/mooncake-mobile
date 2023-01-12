import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import {parseISO} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';
import {useCallback, useMemo, useState} from 'react';
import {useRecoilValue} from 'recoil';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import GetPastActions from 'services/graphql/queries/GetPastActions';

const useHooks = (address: string) => {
  const {currentChain, currentTimezone} = useRecoilValue(appSettingsState);
  const [refetching, setRefetching] = useState(false);
  const [fetchingMore, setFetchingMore] = useState(false);
  const {data: balanceData, loading: balanceLoading} = useQuery(
    GetAccountBalance,
    {
      variables: {
        address,
        tokenName: currentChain.stakeCurrency.coinDenom,
      },
    },
  );

  const {
    data: pastActionsData,
    loading: operationsDataLoading,
    refetch: operationsDataRefetch,
    error,
    fetchMore: operationsDataFetchMore,
    networkStatus,
  } = useQuery(GetPastActions, {
    variables: {
      userAddress: address,
      limit: 8,
      offset: 0,
    },
  });

  const refetch = useCallback(async () => {
    setRefetching(true);
    await operationsDataRefetch().finally(() => {
      setTimeout(() => setRefetching(false), 500);
    });
  }, [operationsDataRefetch]);

  const fetchMore = useCallback(async () => {
    setFetchingMore(true);
    await operationsDataFetchMore({
      variables: {
        offset: pastActionsData?.messages_by_address.length,
      },
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          ...prev,
          messages_by_address: [
            ...prev.messages_by_address,
            ...fetchMoreResult.messages_by_address,
          ],
        };
      },
    }).finally(() => {
      setTimeout(() => setFetchingMore(false), 1000);
    });
  }, [pastActionsData?.messages_by_address.length]);

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
  }, [balanceData, balanceLoading, currentChain?.currencies]);

  const operationsData = useMemo(() => {
    if (!pastActionsData) {
      return [];
    }
    const dates: any[] = pastActionsData.messages_by_address.map((msg: any) => {
      return msg.timestamp.slice(0, -9);
    });

    const uniqueDates = [...new Set(dates)];

    const sections = uniqueDates.map(date => {
      const parsedTime = parseISO(`${date}Z`);

      const formattedDate = formatInTimeZone(
        parsedTime,
        currentTimezone,
        'dd MMM, yyyy',
      );

      return {
        section: formattedDate,
        data: new Array(0),
      };
    });

    pastActionsData.messages_by_address.forEach((msg: any) => {
      const parsedTime = parseISO(`${msg.timestamp}Z`);

      const formattedDate = formatInTimeZone(
        parsedTime,
        currentTimezone,
        'dd MMM, yyyy',
      );

      const sectionToPopulate = sections.find(
        section => section.section === formattedDate,
      );
      if (sectionToPopulate) sectionToPopulate.data.push(msg);
    });

    return sections;
  }, [pastActionsData?.messages_by_address, error]);

  return {
    pastActionsData,
    operationsData,
    convertedBalance,
    currentChain,
    fetchingMore,
    fetchMore,
    operationsDataLoading,
    refetch,
    refetching,
    networkStatus,
  };
};

export default useHooks;
