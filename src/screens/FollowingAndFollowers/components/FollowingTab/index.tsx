import React from 'react';
import {FlatList} from 'react-native';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import dataOfFollowingState from '@recoil/followingAndFollowers/pagesOfFollowingState';
import hasNextPageOfFollowingState from '@recoil/followingAndFollowers/hasNextPageOfFollowingState';
import pageLimitOfFollowingState from '@recoil/followingAndFollowers/pageLimitOfFollowingState';
import EmptyFollowingComponent from '../EmptyFollowingComponent';
import useStyles from './useStyles';
import ListItemOfFollowing from '../ListItemOfFollowing';

/**
 * It renders a FlatList of the user's following
 * @param  - userAddress: The address of the user whose following list we want to display.
 * @returns A list of users that the user is following.
 */
export const FollowingTab = () => {
  const styles = useStyles();
  const pages = useRecoilValue(dataOfFollowingState);
  const hasNextPage = useRecoilValue(hasNextPageOfFollowingState);
  const fetchNext = useRecoilCallback(
    ({set}) =>
      () => {
        if (hasNextPage) {
          set(pageLimitOfFollowingState, prev => prev + 1);
        }
      },
    [hasNextPage],
  );
  return (
    <FlatList
      data={pages}
      renderItem={props => <ListItemOfFollowing {...props} />}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={EmptyFollowingComponent}
      onEndReachedThreshold={1}
      onEndReached={fetchNext}
    />
  );
};

export default FollowingTab;
