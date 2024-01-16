import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'native-base';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';
import { useToggleFollowage } from './hooks';

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
      return <ActivityIndicator color={theme.colors.white} />;
    }
    return following ? t('unfollow') : t('follow');
  }, [fetchingFollowState, following, t, theme.colors.white, updatingFollow]);

  return (
    <View style={styles.buttonView}>
      <Button
        textColor={following ? theme.colors.surfaceBlack : theme.colors.white}
        onPress={toggleFollow}
        size={32}
        variant={following ? 'outline' : 'solid'}
        backgroundColor={following ? theme.colors.white : theme.colors.surfaceBlack}
        style={styles.button}
        disabled={fetchingFollowState || updatingFollow}>
        {buttonContent}
      </Button>
    </View>
  );
};

export default ToggleFollowageButton;
