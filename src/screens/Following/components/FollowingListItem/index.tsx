import React, {FC} from 'react';
import {TouchableOpacity, View} from 'react-native';
import FollowButton from 'components/FollowButton';
import Typography from 'components/Typography';
import {defaultProfilePic} from 'assets/images';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import {useRecoilValue} from 'recoil';
import {isFollowingAddr} from '@recoil/following';
import useActiveAccount from 'hooks/useActiveAccount';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

interface Props extends ProfileSummary {
  // A handler that will redirect the user to the follower's profile page
  onPress: () => void;
}

const FollowingListItem: FC<Props> = ({
  profile_pic,
  nickname,
  dtag,
  address,
  onPress,
}) => {
  const styles = useStyles();

  /* Getting the following state and then it is getting the addresses of the following. */
  const counterParty = {address, dtag, nickname};

  const isFollowing = useRecoilValue(isFollowingAddr(counterParty.address));

  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const {activeAddress} = useActiveAccount();

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FastImage
        source={profile_pic ? {uri: profile_pic} : defaultProfilePic}
        style={styles.pic}
      />
      <View style={styles.names}>
        <Typography.Subtitle3 numberOfLines={1} ellipsizeMode="tail">
          {nickname}
        </Typography.Subtitle3>
        <Typography.Body7
          style={styles.dTagStyle}
          numberOfLines={1}
          ellipsizeMode="tail">
          @{dtag}
        </Typography.Body7>
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
    </TouchableOpacity>
  );
};

export default FollowingListItem;
