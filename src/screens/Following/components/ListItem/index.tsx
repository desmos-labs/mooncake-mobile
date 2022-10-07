import React, {FC} from 'react';
import {Image, ListRenderItemInfo, View} from 'react-native';
import FollowButton from 'components/FollowButton';
import Typography from 'components/Typography';
import {defaultProfilePic} from 'assets/images';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/ManageRelationship/useFollowOrUnfollowUser';
import {useRecoilValue} from 'recoil';
import {isFollowingAddr} from '@recoil/following';
import useActiveAccount from 'hooks/useActiveAccount';
import useStyles from './useStyles';

export type ListItemProps = ListRenderItemInfo<ProfileSummary> & {};

const ListItem: FC<ListItemProps> = ({item}) => {
  const styles = useStyles();

  /* Getting the following state and then it is getting the addresses of the following. */
  const {profile_pic, nickname, dtag, address} = item;
  const counterParty = {address, dtag, nickname};

  const isFollowing = useRecoilValue(isFollowingAddr(counterParty.address));

  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const {activeAddress} = useActiveAccount();

  return (
    <View style={styles.contentContainer}>
      <Image
        source={
          profile_pic
            ? {uri: profile_pic, width: 40, height: 40}
            : defaultProfilePic
        }
        resizeMode="contain"
        borderRadius={40}
        style={styles.pic}
      />
      <View style={styles.names}>
        <Typography.Caption3 numberOfLines={1} ellipsizeMode="tail">
          {nickname}
        </Typography.Caption3>
        <Typography.Caption2 numberOfLines={1} ellipsizeMode="tail">
          @{dtag}
        </Typography.Caption2>
      </View>

      {/* don't show follow button if its the user */}
      {activeAddress !== counterParty.address && (
        <FollowButton
          onPress={() =>
            followOrUnfollowUser({addrToFollow: counterParty.address})
          }
          type={isFollowing ? 'unfollow' : 'follow'}
        />
      )}
    </View>
  );
};

export default ListItem;
