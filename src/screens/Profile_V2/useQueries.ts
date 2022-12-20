import {useQuery} from '@apollo/client';
import {convertCoin} from '@desmoslabs/desmjs';
import {useChainLinks} from '@recoil/chainLinks';
import {useApplicationLinks} from '@recoil/connectedApps';
import appSettingsState from '@recoil/settings';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import React, {useMemo} from 'react';
import {useRecoilValue} from 'recoil';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import GetImpactPoints from 'services/graphql/queries/GetImpactPoints';
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
  });

  const {
    data: impactPointsData,
    loading: impactPointsLoading,
    refetch: refetchImpactPoints,
  } = useQuery(GetImpactPoints);

  const impactPoints = useMemo(() => {
    if (
      !impactPointsData?.impact_record_aggregate?.aggregate?.sum
        ?.rewarded_points
    ) {
      return 0;
    }
    return impactPointsData.impact_record_aggregate.aggregate.sum
      .rewarded_points;
  }, [impactPointsData]);

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

  const {
    chainLinks,
    refetch: refetchChainLinks,
    loading: chainLinksLoading,
  } = useChainLinks(activeAddress!);
  const {
    appLinks,
    refetch: refetchAppLinks,
    loading: appLinksLoading,
  } = useApplicationLinks(activeAddress!);

  const contentLoading = postsLoading && balanceLoading;

  return {
    posts,
    postsData,
    postsLoading,
    convertedBalance,
    balanceData,
    balanceLoading,
    contentLoading,
    appLinks,
    chainLinks,
    appLinksLoading,
    chainLinksLoading,
    refetchAppLinks,
    refetchChainLinks,
    refetchBalance,
    refetchPosts,
    impactPoints,
    impactPointsLoading,
    refetchImpactPoints,
  };
};

export default useQueries;
