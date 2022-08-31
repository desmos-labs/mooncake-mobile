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
import FollowButton from 'components/FollowButton';
import UnfollowButton from 'components/UnfollowButton';
import useStyles from './useStyles';

/* A React component that renders a list of followers. */
const Content: FC<{
  rows: FollowersData[] | undefined;
  page: number;
}> = ({rows, page}) => {
  const styles = useStyles();

  /* Getting the following state and then it is getting the addresses of the following. */
  const following = useRecoilValue(followingState);
  const followingAddresses = following.reduce<{[p: string]: boolean}>(
    (r, {address}) => ({...r, [address]: true}),
    {},
  );
  const {subspaceID, userAddress} = useRecoilValue(routeState);
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
              <FollowButton
                subspaceID={subspaceID}
                counterPartyAddress={userAddress}
                creatorAddrees={d.address}
              />
            )}
            {!!followingAddresses[d.address] && (
              <UnfollowButton
                subspaceID={subspaceID}
                creatorAddrees={userAddress}
                counterPartyAddress={d.address}
              />
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

/* A React component that renders a list of followers. */
const ListItem: ListRenderItem<number> = ({item: page}) => {
  /* Getting the subspaceID, userAddress, and cacheKey from the routeState. Then it is
  creating a query with the subspaceID, userAddress, cacheKey, and page. Then it is getting the
  loadable from the query. Then it is getting the rows from the loadable. */
  const {subspaceID, userAddress, cacheKey} = useRecoilValue(routeState);
  const query = queryState({
    stateType: 'followers',
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
      return <Content rows={rows} page={page} />;
    }
    case 'hasError':
      return <Error query={query} loadable={loadable} />;
    default:
      return <Loading />;
  }
};

export default ListItem;
