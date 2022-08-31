import React from 'react';
import {FlatList} from 'react-native';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import pagesState from '@recoil/followingAndFollowers/pagesState';
import pageLimitState from '@recoil/followingAndFollowers/pageLimitState';
import EmptyFollowingComponent from '../EmptyComponentOfFollowing';
import useStyles from './useStyles';
import ListItem from '../ListItemOfFollowing';

/**
 * It renders a FlatList of the user's following
 * @param  - userAddress: The address of the user whose following list we want to display.
 * @returns A list of users that the user is following.
 */
export const FollowingTab = () => {
  const styles = useStyles();
  const pages = useRecoilValue(pagesState('following'));
  const fetchNext = useRecoilCallback(
    ({set}) =>
      () =>
        set(pageLimitState('following'), prev => prev + 1),
    [],
  );
  return (
    <FlatList
      data={pages}
      renderItem={props => <ListItem {...props} />}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={EmptyFollowingComponent}
      onEndReachedThreshold={1}
      onEndReached={fetchNext}
    />
  );
};

export default FollowingTab;
