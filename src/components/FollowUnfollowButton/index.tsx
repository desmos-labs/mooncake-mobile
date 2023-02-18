import React from 'react';
import { TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

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
  const styles = useStyles();

  const { isFollowing, onPress } = props;

  return isFollowing ? (
    <TouchableOpacity style={styles.unfollowButton} onPress={onPress}>
      <Typography.Subtitle4 style={{ color: theme.colors.surfaceBlack }}>
        {t('following')}
      </Typography.Subtitle4>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.followButton} onPress={onPress}>
      <Typography.Subtitle4 style={{ color: theme.colors.white }}>
        {t('follow')}
      </Typography.Subtitle4>
    </TouchableOpacity>
  );
};

export default FollowUnfollowButton;
