import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { useTheme } from 'native-base';

export interface FollowUnfollowButtonProps {
  /**
   * Whether the user is following the profile or not.
   */
  isFollowing: boolean;
  /**
   * Action to be performed when the user presses the button.
   */
  onPress: () => void;
}

/**
 * React component that represents a button to follow or unfollow a profile.
 * @constructor
 */
const FollowUnfollowButton = (props: FollowUnfollowButtonProps) => {
  const { t } = useTranslation('profile');
  const theme = useTheme();
  const { isFollowing, onPress } = props;

  return isFollowing ? (
    <Button
      mt="s"
      backgroundColor={theme.colors.surfaceGrey}
      minWidth="80px"
      size={32}
      onPress={onPress}
      textColor={theme.colors.surfaceBlack}>
      {t('following')}
    </Button>
  ) : (
    <Button
      mt="s"
      backgroundColor={theme.colors.surfaceBlack}
      minWidth="80px"
      size={32}
      onPress={onPress}
      textColor={theme.colors.white}>
      {t('follow')}
    </Button>
  );
};

export default FollowUnfollowButton;
