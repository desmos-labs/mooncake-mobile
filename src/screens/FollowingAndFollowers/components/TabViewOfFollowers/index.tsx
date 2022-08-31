import React from 'react';
import {FlatList} from 'react-native';
import {useRecoilCallback, useRecoilValue} from 'recoil';
import pagesState from '@recoil/followingAndFollowers/pagesState';
import pageLimitState from '@recoil/followingAndFollowers/pageLimitState';
import EmptyFollowersComponent from '../EmptyComponentOfFollowers';
import useStyles from './useStyles';
import ListItem from '../ListItemOfFollowers';

/**
 * It renders a FlatList of followers
 * @param  - userAddress: The address of the user whose followers you want to display.
 * @returns A FlatList component that renders a list of followers.
 */
export const FollowersTab = () => {
  const styles = useStyles();
  const pages = useRecoilValue(pagesState('followers'));
  const fetchNext = useRecoilCallback(
    ({set}) =>
      () =>
        set(pageLimitState('followers'), prev => prev + 1),
    [],
  );
  return (
    <FlatList
      data={pages}
      renderItem={props => <ListItem {...props} />}
      contentContainerStyle={styles.contentContainerStyle}
      ListEmptyComponent={EmptyFollowersComponent}
      onEndReachedThreshold={1}
      onEndReached={fetchNext}
    />
  );
};

export default FollowersTab;
