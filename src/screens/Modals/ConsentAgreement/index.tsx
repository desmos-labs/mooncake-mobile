import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Button from 'components/Button';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
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
    <TouchableOpacity
      activeOpacity={1}
      onPress={goBack}
      style={styles.container}>
      {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
      {/* parts of the modal content are pressed */}
      <TouchableOpacity activeOpacity={1} style={styles.innerContainer}>
        <View style={styles.tabIcon} />
        <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
        <Typography.Body5>{t('description')}</Typography.Body5>

        <Spacer paddingTop={40}>
          <ConsentButtonGroup
            handlePressTOS={handlePressTOS}
            handlePressPP={handlePressPP}
          />
        </Spacer>

        <Button
          mode="contained"
          style={styles.confirmButton}
          onPress={handlePressContinue}>
          {t('common:continue')}
        </Button>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ConsentAgreement;
