import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import {parseISO} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';
import {useMemo} from 'react';
import {useRecoilValue} from 'recoil';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import GetPastActions from 'services/graphql/queries/GetPastActions';

const useHooks = (address: string) => {
  const {currentChain, currentTimezone} = useRecoilValue(appSettingsState);

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
  } = useQuery(GetPastActions, {
    variables: {
      userAddress: address,
      limit: 10,
      offset: 0,
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
  }, [pastActionsData, error]);

  return {
    pastActionsData,
    operationsData,
    convertedBalance,
    currentChain,
    operationsDataFetchMore,
    operationsDataLoading,
    operationsDataRefetch,
  };
};

export default useHooks;
