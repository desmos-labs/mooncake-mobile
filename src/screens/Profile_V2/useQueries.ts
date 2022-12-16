import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import React, {useCallback, useMemo} from 'react';
import {useRecoilValue} from 'recoil';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import GetPostsForAddressWithLimit from 'services/graphql/queries/GetPostsForAddressWithLimit';

const useQueries = () => {
  const {activeAddress} = useActiveAccount();
  const {currentChain} = useRecoilValue(appSettingsState);
  const {
    data: postsData,
    loading: postsLoading,
    refetch: refetchPosts,
  } = useQuery(GetPostsForAddressWithLimit, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      address: activeAddress,
      limit: 10,
    },
    fetchPolicy: 'no-cache',
  });

  const posts: [] = React.useMemo(() => {
    if (!postsData) return [];
    return postsData.post;
  }, [postsData, postsLoading]);

  const {
    data: balanceData,
    loading: balanceLoading,
    refetch: refetchBalance,
  } = useQuery(GetAccountBalance, {
    variables: {
      address: activeAddress,
      tokenName: currentChain.stakeCurrency.coinDenom,
    },
    fetchPolicy: 'no-cache',
  });

  const convertedBalance = useMemo(() => {
    let balanceToReturn;
    if (balanceData && !balanceLoading) {
      balanceToReturn = convertCoin(
        balanceData?.action_account_balance?.coins[0],
        6,
        currentChain.currencies,
      );
      console.log(balanceData.token_price[0]);
    }
    return balanceToReturn;
  }, [balanceData, balanceLoading, currentChain]);

  const globalLoading = postsLoading && balanceLoading;

  const refetchEveryQuery = useCallback(() => {
    refetchPosts();
    refetchBalance();
  }, []);

  return {
    posts,
    postsData,
    postsLoading,
    convertedBalance,
    balanceData,
    balanceLoading,
    globalLoading,
    refetchEveryQuery,
  };
};

export default useQueries;
