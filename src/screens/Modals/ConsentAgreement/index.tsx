import React from 'react';
import Button from 'components/Button';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {useTheme} from 'react-native-paper';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import ConsentButtonGroup from './components/ConsentButtonGroup';
import useStyles from './useStyles';

export type ConsentAgreementParams = {
  onConsentAgree: () => void;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONSENT_AGREEMENT
>;

const ConsentAgreement = () => {
  const {t} = useTranslation('consentAgreement');
  const styles = useStyles();
  const theme = useTheme();
  const {
    params: {onConsentAgree},
  } = useRoute<NavProps['route']>();
  const {goBack} = useNavigation<NavProps['navigation']>();

  const handlePressTOS = React.useCallback(() => {
    // implementation
  }, []);

  const handlePressPP = React.useCallback(() => {
    // implementation
  }, []);

  const handlePressContinue = React.useCallback(() => {
    // Looking for device screen will show this consent screen if consent is not
    // already given, so we can just go back once the user accepts
    onConsentAgree();
    setMMKV(MMKVKEYS.CONSENT_GIVEN, true);
  }, []);

  return (
    <BottomUpModalWrapper goBack={goBack}>
      <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
      <Typography.Body5>{t('description')}</Typography.Body5>

      <Spacer paddingVertical={40}>
        <ConsentButtonGroup
          handlePressTOS={handlePressTOS}
          handlePressPP={handlePressPP}
        />
      </Spacer>

      <Button
        size={44}
        backgroundColor={theme.colors.surfaceBlack}
        textColor={theme.colors.white}
        mode="contained"
        onPress={handlePressContinue}>
        {t('common:continue')}
      </Button>
    </BottomUpModalWrapper>
  );
};

export default ConsentAgreement;
