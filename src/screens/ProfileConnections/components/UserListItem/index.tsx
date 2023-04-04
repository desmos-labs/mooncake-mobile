import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import FastImage from 'react-native-fast-image';
import { DesmosProfile } from 'types/desmos';
import { getProfilePicture } from 'lib/ProfileUtils';
import { useActiveAccountAddress } from '@recoil/accounts';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import FollowUnfollowButton from 'components/FollowUnfollowButton';
import useStyles from './useStyles';

interface UserListItemProps {
  /**
   * Address of the user for which the list is being rendered.
   */
  readonly profileAddress: string;
  /**
   * User to be rendered.
   */
  readonly user: DesmosProfile;
  /**
   * Action to be performed when the user clicks on an item.
   */
  readonly onPress: () => void;
}

/**
 * Component that allows to render a single user item within a list.
 * @constructor
 */
const UserListItem = (props: UserListItemProps) => {
  const styles = useStyles();

  const { profileAddress, user, onPress } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeAccountAddress = useActiveAccountAddress();
  const isActiveAccount = activeAccountAddress === profileAddress;

  const { isFollowing, refetch: refreshFollowing } = useIsFollowing(user.address);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const followOrUnfollowUser = useFollowOrUnfollowUser();

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    refreshFollowing();

    // It's fine to disable the exhaustive deps check here because we only want to run this once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Profile picture */}
      <FastImage source={getProfilePicture(user)} style={styles.pic} />

      {/* Profile DTag and nickname */}
      <View style={styles.names}>
        <Typography.Subtitle3 numberOfLines={1} ellipsizeMode="tail">
          {user.nickname}
        </Typography.Subtitle3>
        <Typography.Body7 style={styles.dTagStyle} numberOfLines={1} ellipsizeMode="tail">
          @{user.dTag}
        </Typography.Body7>
      </View>

      {/* Button to follow or unfollow a user */}
      {!isActiveAccount && (
        <FollowUnfollowButton
          onPress={() => followOrUnfollowUser(user)}
          isFollowing={isFollowing}
        />
      )}
    </TouchableOpacity>
  );
};

export default UserListItem;
