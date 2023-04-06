import Button from 'components/Button';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useTheme } from 'native-base';
import { DesmosProfile } from 'types/desmos';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
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

  const { isFollowing } = useIsFollowing(user.address);
  const navigateToProfile = useNavigateToProfile();

  const handleButtonPress = useCallback(() => {
    navigateToProfile(user.address);
  }, [navigateToProfile, user.address]);

  return (
    <View style={styles.buttonView}>
      <Button
        textColor={isFollowing ? theme.colors.surfaceBlack : theme.colors.white}
        onPress={handleButtonPress}
        size={32}
        variant={isFollowing ? 'outline' : 'solid'}
        backgroundColor={isFollowing ? theme.colors.white : theme.colors.surfaceBlack}
        style={styles.button}>
        {t(isFollowing ? 'unfollow' : 'follow')}
      </Button>
    </View>
  );
};

export default ToggleFollowageButton;
