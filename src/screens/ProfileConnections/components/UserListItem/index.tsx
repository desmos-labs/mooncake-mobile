import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useActiveAccountAddress } from '@recoil/accounts';
import ToggleFollowageButton from 'components/ToggleFollowageButton';
import { Image } from 'expo-image';
import { getProfilePicture } from 'lib/ProfileUtils';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
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

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {/* Profile picture */}
      <Image source={getProfilePicture(user)} style={styles.pic} />
      {/* Profile DTag and nickname */}
      <View style={styles.names}>
        <Typography.Semibold14 numberOfLines={1} ellipsizeMode="tail">
          {user.nickname}
        </Typography.Semibold14>
        <Typography.Regular12 style={styles.dTagStyle} numberOfLines={1} ellipsizeMode="tail">
          @{user.dTag}
        </Typography.Regular12>
      </View>
      {/* Button to follow or unfollow a user */}
      {!isActiveAccount && <ToggleFollowageButton user={user} buttonWidth={99} />}
    </TouchableOpacity>
  );
};

export default UserListItem;
