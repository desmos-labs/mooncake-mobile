import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONVERTIBLE_POINTS_MODAL
>;

const ConvertiblePointsModal = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('invites');
  const {goBack} = useNavigation<NavProps['navigation']>();

  return (
    <BottomUpModalWrapper goBack={goBack}>
      <Typography.H4 style={styles.headerText}>
        {t('convertible title modal')}
      </Typography.H4>
      <Spacer paddingVertical={16} />
      <Typography.Body5>{t('convertible body modal')}</Typography.Body5>
      <Spacer paddingTop={20} paddingBottom={20}>
        <Typography.Body5>{t('convertible body modal 2')}</Typography.Body5>
      </Spacer>
      <Spacer paddingVertical={theme.spacing.xl}>
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={goBack}>
          {t('got it')}
        </Button>
      </Spacer>
    </BottomUpModalWrapper>
  );
};

export default ConvertiblePointsModal;
