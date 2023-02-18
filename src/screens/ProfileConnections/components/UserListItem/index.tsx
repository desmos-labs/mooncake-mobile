import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import FastImage from 'react-native-fast-image';
import { DesmosProfile } from 'types/desmos';
import { getProfilePicture } from 'lib/ProfileUtils';
import useStyles from './useStyles';

interface UserListItemProps {
  /**
   *
   */
  user: DesmosProfile;
  /**
   * Action to be performed when the user clicks on an item.
   */
  onPress: () => void;
}

/**
 * Component that allows to render a single user item within a list.
 * @constructor
 */
const UserListItem = (props: UserListItemProps) => {
  const styles = useStyles();

  const { user, onPress } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FastImage source={getProfilePicture(user)} style={styles.pic} />
      <View style={styles.names}>
        <Typography.Subtitle3 numberOfLines={1} ellipsizeMode="tail">
          {user.nickname}
        </Typography.Subtitle3>
        <Typography.Body7 style={styles.dTagStyle} numberOfLines={1} ellipsizeMode="tail">
          @{user.dTag}
        </Typography.Body7>
      </View>

      {/* don't show follow button if its the user */}
      {/* [Kevin-17-01-2023]-Temporarily disabled until fixed */}
      {/* {activeAddress !== counterParty.address && ( */}
      {/*  <FollowButton */}
      {/*    onPress={() => */}
      {/*      followOrUnfollowUser({addrToFollow: counterParty.address}) */}
      {/*    } */}
      {/*    type={isFollowing ? 'unfollow' : 'follow'} */}
      {/*  /> */}
      {/* )} */}
    </TouchableOpacity>
  );
};

export default UserListItem;
