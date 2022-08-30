import {followingState} from '@recoil/following';
import {PaginatedData} from '@recoil/followingAndFollowers';
import routeState from '@recoil/followingAndFollowers/routeState';
import queryState from '@recoil/followingAndFollowers/queryState';
import React, {FC, Fragment} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ListRenderItem, Text, View} from 'react-native';
import {ActivityIndicator, Button, useTheme} from 'react-native-paper';
import {
  Loadable,
  RecoilValueReadOnly,
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
} from 'recoil';
import useStyles from './useStyles';

/* A React component that renders a list of following accounts. */
const Content: FC<{
  query: RecoilValueReadOnly<PaginatedData<FollowersData>>;
  rows: FollowersData[] | undefined;
  page: number;
}> = ({query, rows, page}) => {
  const styles = useStyles();
  const {t} = useTranslation('followingAndFollowers');

  /* Getting the following state and then it is getting the addresses of the following. */
  const following = useRecoilValue(followingState);
  const followingAddresses = following.reduce<{[p: string]: boolean}>(
    (r, {address}) => ({...r, [address]: true}),
    {},
  );
  const handleFollow = useRecoilCallback(
    ({refresh}) =>
      () =>
        refresh(query),
    [query],
  );
  const handleUnfollow = useRecoilCallback(
    ({refresh}) =>
      () =>
        refresh(query),
    [query],
  );
  return (
    <>
      {rows!.map((d, i) => (
        <Fragment key={d.dtag}>
          {(page > 1 || i > 0) && <View style={styles.divider} />}
          <View style={styles.contentContainer}>
            <View style={styles.pic}>
              {!!d.profile_pic && (
                <Image
                  source={{uri: d.profile_pic, width: 40, height: 40}}
                  borderRadius={40}
                />
              )}
            </View>
            <View style={styles.names}>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {d.nickname}
              </Text>
              <Text
                style={styles.subtitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                @{d.dtag}
              </Text>
            </View>
            {!followingAddresses[d.address] && (
              <Button
                mode="contained"
                uppercase={false}
                onPress={handleFollow}
                style={styles.followButton}
                labelStyle={styles.followButtonLabel}>
                {t('follow')}
              </Button>
            )}
            {!!followingAddresses[d.address] && (
              <Button
                mode="outlined"
                uppercase={false}
                onPress={handleUnfollow}
                style={styles.unfollowButton}
                labelStyle={styles.unfollowButtonLabel}>
                {t('unfollow')}
              </Button>
            )}
          </View>
        </Fragment>
      ))}
    </>
  );
};

/**
 * It returns a View component with an ActivityIndicator component inside
 * @returns A React component that displays a loading indicator.
 */
const Loading: FC = () => {
  const styles = useStyles();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator />
    </View>
  );
};

/* A React component that renders an error message. */
const Error: FC<{
  query: RecoilValueReadOnly<PaginatedData<FollowersData>>;
  loadable: Loadable<PaginatedData<FollowersData>>;
}> = ({query, loadable}) => {
  const styles = useStyles();
  const {t} = useTranslation('followingAndFollowers');

  /* Creating a callback that refreshes the query. */
  const handleRetry = useRecoilCallback(
    ({refresh}) =>
      () =>
        refresh(query),
    [query],
  );

  const theme = useTheme();

  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorMessage}>
        <Text style={styles.errorTitle}>{t('oops')}</Text>
        <Text style={styles.errorText}>{String(loadable.errorMaybe())}</Text>
      </View>
      <Button
        mode="text"
        uppercase={false}
        color={theme.colors.text}
        onPress={handleRetry}>
        {t('retry')}
      </Button>
    </View>
  );
};

/* A React component that renders a list of following accounts. */
const ListItem: ListRenderItem<number> = ({item: page}) => {
  /* Getting the subspaceID, userAddress, and cacheKey from the routeState. Then it is
  creating a query with the subspaceID, userAddress, cacheKey, and page. Then it is getting the
  loadable from the query. Then it is getting the rows from the loadable. */
  const {subspaceID, userAddress, cacheKey} = useRecoilValue(routeState);
  const query = queryState({
    stateType: 'following',
    subspaceID,
    userAddress,
    cacheKey,
    page,
  });
  const loadable = useRecoilValueLoadable(query);
  const dedup = new Set<string>();
  const rows = loadable
    .valueMaybe()
    ?.data.map(d => {
      if (!d || dedup.has(d.dtag)) return undefined;
      dedup.add(d.dtag);
      return d;
    })
    .filter((d): d is FollowersData => d !== undefined);

  switch (loadable.state) {
    case 'hasValue': {
      return <Content query={query} rows={rows} page={page} />;
    }
    case 'hasError':
      return <Error query={query} loadable={loadable} />;
    default:
      return <Loading />;
  }
};

export default ListItem;
