import React, {FC} from 'react';
import {Image, ListRenderItemInfo, Text, View} from 'react-native';
import {QueueData} from 'services/graphql/queries/GetPaginatedFollowing';
import {useRecoilValue} from 'recoil';
import FollowButton from 'components/FollowButton';
import UnfollowButton from 'components/UnfollowButton';
import followedAddressesState from '@recoil/followedAddressesState';
import useStyles from './useStyles';

const ListItem: FC<
  ListRenderItemInfo<QueueData['paginatedFollowers'][number]>
> = ({item}) => {
  const styles = useStyles();

  /* Getting the following state and then it is getting the addresses of the following. */
  const followingAddress = useRecoilValue(followedAddressesState);
  const {
    _: {profile_pic, nickname, dtag, address},
  } = item;
  return (
    <View style={styles.contentContainer}>
      <View style={styles.pic}>
        {!!profile_pic && (
          <Image
            source={{uri: profile_pic, width: 40, height: 40}}
            borderRadius={40}
          />
        )}
      </View>
      <View style={styles.names}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {nickname}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
          @{dtag}
        </Text>
      </View>
      {!followingAddress.has(address) && <FollowButton />}
      {followingAddress.has(address) && <UnfollowButton />}
    </View>
  );
};

export default ListItem;
