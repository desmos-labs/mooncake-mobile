import React from 'react';
import {FlatList} from 'react-native';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import pagesOfFollowersState from '@recoil/followingAndFollowers/pagesOfFollowersState';
import hasNextPageOfFollowersState from '@recoil/followingAndFollowers/hasNextPageOfFollowersState';
import pageLimitOfFollowersState from '@recoil/followingAndFollowers/pageLimitOfFollowersState';
import EmptyFollowersComponent from '../EmptyFollowersComponent';
import useStyles from './useStyles';
import ListItemOfFollowers from '../ListItemOfFollowers';

/**
 * It renders a FlatList of followers
 * @param  - userAddress: The address of the user whose followers you want to display.
 * @returns A FlatList component that renders a list of followers.
 */
export const FollowersTab = () => {
  const styles = useStyles();
  const pages = useRecoilValue(pagesOfFollowersState);
  const hasNextPage = useRecoilValue(hasNextPageOfFollowersState);
  const fetchNext = useRecoilCallback(
    ({set}) =>
      () => {
        if (hasNextPage) {
          set(pageLimitOfFollowersState, prev => prev + 1);
        }
      },
    [hasNextPage],
  );
  return (
    <FlatList
      data={pages}
      renderItem={props => <ListItemOfFollowers {...props} />}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={EmptyFollowersComponent}
      onEndReachedThreshold={1}
      onEndReached={fetchNext}
    />
  );
};

export default FollowersTab;
