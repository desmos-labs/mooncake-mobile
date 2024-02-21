import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from '@react-navigation/native';
import Button from 'components/Button';
import commonStyles from 'config/theme/CommonStyles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { DimensionValue } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import { DesmosProfile } from 'types/desmos';
import { useToggleFollowage } from './hooks';
import useStyles from './useStyles';

interface NotificationButtonProps {
  readonly user: DesmosProfile;
  readonly style?: StyleProp<ViewStyle>;
  readonly buttonStyle?: StyleProp<ViewStyle>;
  readonly buttonWidth?: DimensionValue | undefined;
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

  const { user, style, buttonWidth, buttonStyle } = props;
  const { toggleFollow, following, updatingFollow } = useToggleFollowage(user);

  const buttonContent = React.useMemo(() => {
    if (updatingFollow) {
      return (
        <ActivityIndicator
          color={following ? theme.colors.neutralVariants['900'] : theme.colors.white}
        />
      );
    }
    return (
      <Typography.Semibold14 style={following ? commonStyles.textBlack : commonStyles.textWhite}>
        {following ? t('following') : t('follow')}
      </Typography.Semibold14>
    );
  }, [following, t, theme.colors.neutralVariants, theme.colors.white, updatingFollow]);

  return (
    <View style={[styles.buttonView, style]}>
      <Button
        onPress={toggleFollow}
        height={32}
        type="solid"
        style={[
          styles.button,
          following ? styles.unfollowButton : null,
          buttonWidth ? { width: buttonWidth } : null,
          buttonStyle,
        ]}
        disabled={updatingFollow}>
        {buttonContent}
      </Button>
    </View>
  );
};

export default ToggleFollowageButton;
