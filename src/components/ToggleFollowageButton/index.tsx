import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import Button from 'components/Button';
import commonStyles from 'config/theme/CommonStyles';
import { useTheme } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
import { useToggleFollowage } from './hooks';
import useStyles from './useStyles';

interface NotificationButtonProps {
  readonly user: DesmosProfile;
}

/**
 * Component that represents a button that is shown associated to a notification
 * and allows to follow or unfollow a user.
 * @constructor
 */
const ToggleFollowageButton = (props: NotificationButtonProps) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('relationships');

  const { user } = props;
  const { toggleFollow, following, fetchingFollowState, updatingFollow } = useToggleFollowage(user);

  const buttonContent = React.useMemo(() => {
    if (fetchingFollowState || updatingFollow) {
      return (
        <ActivityIndicator color={following ? theme.colors.surfaceBlack : theme.colors.white} />
      );
    }
    return (
      <Typography.Semibold14 style={following ? commonStyles.textBlack : commonStyles.textWhite}>
        {following ? t('unfollow') : t('follow')}
      </Typography.Semibold14>
    );
  }, [
    fetchingFollowState,
    following,
    t,
    theme.colors.surfaceBlack,
    theme.colors.white,
    updatingFollow,
  ]);

  return (
    <View style={styles.buttonView}>
      <Button
        onPress={toggleFollow}
        height={32}
        type="solid"
        style={[styles.button, following ? styles.unfollowButton : null]}
        disabled={fetchingFollowState || updatingFollow}>
        {buttonContent}
      </Button>
    </View>
  );
};

export default ToggleFollowageButton;
