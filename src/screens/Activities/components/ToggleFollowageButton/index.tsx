import Button from 'components/Button';
import Typography from 'components/Typography';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { DesmosProfile } from 'types/desmos';
import useIsFollowing from 'hooks/useIsFollowing';
import { GuestProfileParamsTypes } from 'screens/GuestProfile';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import useStyles from './useStyles';

export interface NotificationButtonProps {
  readonly user: DesmosProfile;
}

/**
 * Component that represents a button that is shown associated to a notification
 * and allows to follow or unfollow a user.
 * @constructor
 */
const ToggleFollowageButton = (props: NotificationButtonProps) => {
  const theme = useTheme();
  const styles = useStyles(props);
  const { t } = useTranslation('followingAndFollowers');

  const { user } = props;

  const isFollowing = useIsFollowing(user.address);
  const navigateToProfile = useNavigateToProfile();

  const handleButtonPress = useCallback(() => {
    navigateToProfile({
      type: GuestProfileParamsTypes.COMPLETE,
      profile: user,
    });
  }, [navigateToProfile, user]);

  return (
    <View style={styles.buttonView}>
      <Button
        onPress={handleButtonPress}
        mode="outlined"
        color={isFollowing ? theme.colors.surfaceBlack : theme.colors.butterOrange01}
        style={styles.button}>
        <Typography.Button3 style={styles.buttonText}>
          {t(isFollowing ? 'unfollow' : 'follow')}
        </Typography.Button3>
      </Button>
    </View>
  );
};

export default ToggleFollowageButton;
