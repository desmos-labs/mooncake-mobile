import React from 'react';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useRoute} from '@react-navigation/native';
import {View} from 'react-native';
import Button, {ButtonMode} from 'components/Button';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type ConfirmAddressParams = {
  address: string;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONFIRM_ADDRESS
>;

const ConfirmAddress = () => {
  const {t} = useTranslation('confirmAddress');
  const styles = useStyles();
  const {
    params: {address},
  } = useRoute<NavProps['route']>();

  const theme = useTheme();

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white}>
      <Typography.H5 style={styles.textStyle}>{t('header')}</Typography.H5>

      <Spacer paddingTop={theme.spacing.m}>
        <Typography.Body6 style={styles.textStyle}>
          {t('isThisYourAddress')}
        </Typography.Body6>
      </Spacer>

      <View style={styles.addressPreviewBox}>
        <Typography.Body5 style={styles.textStyle}>{address}</Typography.Body5>
      </View>

      <Button
        size={44}
        textColor={theme.colors.white}
        backgroundColor={theme.colors.surfaceBlack}
        mode={ButtonMode.CONTAINED}
        onPress={() => {}}>
        {t('yesContinue')}
      </Button>

      <Spacer paddingTop={theme.spacing.l}>
        <Button size={44} mode={ButtonMode.OUTLINED} onPress={() => {}}>
          {t('noChangeIt')}
        </Button>
      </Spacer>
    </DView>
  );
};

export default ConfirmAddress;
