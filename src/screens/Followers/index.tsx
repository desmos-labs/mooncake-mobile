import React, {FC, useCallback} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import pagesState from '@recoil/followingAndFollowers/pagesState';
import pageLimitState from '@recoil/followingAndFollowers/pageLimitState';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import EmptyFollowersComponent from './components/EmptyComponent';
import useStyles from './useStyles';
import ListItem from './components/ListItem';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.FOLLOWERS
>;

/**
 * @property {string} cacheKey - A unique string that will be used to cache the data.
 * @property {number} subspaceID - The ID of the subspace you want to get the followers for.
 * @property {string} userAddress - The address of the user you want to get the followers for.
 * @property {string} username - The username of the user you want to get the followers for.
 */
export type FollowersParams = {
  cacheKey: string;
  subspaceID: number;
  userAddress: string;
  username: string;
};

/**
 * It renders a FlatList of the user's followers
 * @param  - userAddress: The address of the user whose followers list we want to display.
 * @returns A list of users that the user is followers.
 */
export const FollowersTab: FC<NavProps> = ({route}) => {
  const {subspaceID, userAddress} = route.params;
  const styles = useStyles();
  const pages = useRecoilValue(pagesState('followers'));
  const fetchNext = useRecoilCallback(
    ({set}) =>
      () =>
        set(pageLimitState('followers'), prev => prev + 1),
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
      ListEmptyComponent={EmptyFollowersComponent}
      onEndReachedThreshold={1}
      onEndReached={fetchNext}
    />
  );
};

export default FollowersTab;
