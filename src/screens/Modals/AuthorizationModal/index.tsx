import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import Button from 'components/Button';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Spacer from 'components/Spacer';
import { useTheme } from 'native-base';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import CommonStyles from 'config/theme/CommonStyles';
import useStyles from './useStyles';

export type AuthorizationModalParams = {
  /**
   * What to do when the user presses the close button.
   */
  onDismiss?: () => void;
  /**
   * What to do when the user presses the primary (main) modal button.
   */
  onPressYes: () => void;
  /**
   * What to do when the user presses the secondary (bottom-one) modal button.
   */
  onPressNo: () => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.AUTHORIZATION_MODAL>;

/**
 * Modal to request authorization for simplified tx broadcasting
 * @constructor
 */
const AuthorizationModal = () => {
  const {
    params: { onDismiss, onPressYes, onPressNo },
  } = useRoute<NavProps['route']>();
  const { t } = useTranslation('broadcastTx');
  const styles = useStyles();
  const theme = useTheme();

  const { goBack } = useNavigation<NavProps['navigation']>();

  // Tells whether or not to call the onDismiss callback when the user goes back
  const [callOnDismissOnGoBack, setCallOnDismissOnGoBack] = useState(true);

  // This is to make sure that onDismiss is not called unless we want to
  const closeWithoutDismiss = useCallback(() => {
    setCallOnDismissOnGoBack(false);
    setTimeout(() => goBack(), 200);
  }, [goBack]);

  // Little hack to make sure the modal is dismissed before the onPress callback is invoked
  const onPressPrimaryButton = useCallback(() => {
    closeWithoutDismiss();
    onPressYes && setTimeout(() => onPressYes(), 200);
  }, [closeWithoutDismiss, onPressYes]);

  // Little hack to make sure the modal is dismissed before the onPress callback is invoked
  const onPressSecondaryButton = useCallback(() => {
    closeWithoutDismiss();
    onPressNo && setTimeout(() => onPressNo(), 200);
  }, [closeWithoutDismiss, onPressNo]);

  // Little hack to make sure the modal is dismissed before the onDismiss callback is invoked
  const onPressDismiss = useCallback(() => {
    goBack();
  }, [goBack]);

  // If the user goes back, consider it as a dismiss
  useOnBackAction(() => {
    if (callOnDismissOnGoBack && onDismiss) {
      setTimeout(() => onDismiss(), 200);
    }
  }, [callOnDismissOnGoBack, onDismiss]);

  return (
    <View style={styles.container}>
      {/* invoke dismiss fn or goBack if user presses the background */}
      <TouchableOpacity
        onPress={onPressDismiss}
        activeOpacity={1}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.innerContainer}>
        <Spacer paddingBottom={16}>
          <Typography.H4 style={CommonStyles.textAlign.center}>{t('permissions')}</Typography.H4>
        </Spacer>

        <Typography.Body5>{t('permissions modal subtitle')}</Typography.Body5>
        <Spacer paddingTop={theme.spacing.m} />
        <Typography.Body5>{t('permissions modal body')}</Typography.Body5>

        <Spacer paddingTop={theme.spacing.xl}>
          <Button
            textColor={theme.colors.white}
            backgroundColor={theme.colors.surfaceBlack}
            size={44}
            onPress={onPressPrimaryButton}>
            {t('common:yes')}
          </Button>
          <Spacer paddingTop={theme.spacing.m}>
            <Button
              textColor={theme.colors.surfaceBlack}
              variant="outlined"
              size={44}
              onPress={onPressSecondaryButton}>
              {t('common:no')}
            </Button>
          </Spacer>
        </Spacer>
      </View>
    </View>
  );
};

export default AuthorizationModal;
