import React, {FC, useCallback} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import pagesState from '@recoil/followingAndFollowers/pagesState';
import pageLimitState from '@recoil/followingAndFollowers/pageLimitState';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import EmptyFollowingComponent from './components/EmptyComponent';
import useStyles from './useStyles';
import ListItem from './components/ListItem';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.FOLLOWING
>;

/**
 * @property {string} cacheKey - A unique string that will be used to cache the data.
 * @property {number} subspaceID - The ID of the subspace you want to get the following list for.
 * @property {string} userAddress - The address of the user you want to get the following list for.
 * @property {string} username - The username of the user you want to get the following list for.
 */
export type FollowingParams = {
  cacheKey: string;
  subspaceID: number;
  userAddress: string;
  username: string;
};

/**
 * It renders a FlatList of the user's following
 * @param  - userAddress: The address of the user whose following list we want to display.
 * @returns A list of users that the user is following.
 */
export const FollowingTab: FC<NavProps> = ({route}) => {
  const {subspaceID, userAddress} = route.params;
  const styles = useStyles();
  const pages = useRecoilValue(pagesState('following'));
  const fetchNext = useRecoilCallback(
    ({set}) =>
      () =>
        set(pageLimitState('following'), prev => prev + 1),
    [],
  );
  const RenderItem = useCallback(
    (props: ListRenderItemInfo<number>) => {
      return (
        <ListItem
          subspaceID={subspaceID}
          userAddress={userAddress}
          {...props}
        />
      );
    },
    [subspaceID, userAddress],
  );
  return (
    <FlatList
      data={pages}
      renderItem={RenderItem}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={EmptyFollowingComponent}
      onEndReachedThreshold={1}
      onEndReached={fetchNext}
    />
  );
};

export default FollowingTab;
