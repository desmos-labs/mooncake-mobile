import React from 'react';
import Button from 'components/Button';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useSetAppStateValue } from '@recoil/appState';
import BottomUpModalWrapper from 'components/BottomUpModalWrapper';
import { Box, Checkbox, HStack, useTheme } from 'native-base';
import CustomCheckbox from 'components/CustomCheckbox';
import CommonStyles from 'config/theme/CommonStyles';
import ConsentButtonGroup from './components/ConsentButtonGroup';
import useStyles from './useStyles';

export type ConsentAgreementParams = {
  /**
   * Callback that is used after the user presses the button to give the consent.
   */
  onConsentAgree: () => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONSENT_AGREEMENT>;

/**
 * Screen allowing to accept the Terms of Use and Privacy policies of Butter.
 */
const ConsentAgreement = () => {
  const { t } = useTranslation('consentAgreement');
  const styles = useStyles();
  const theme = useTheme();

  const { params } = useRoute<NavProps['route']>();
  const { goBack } = useNavigation<NavProps['navigation']>();

  const [checkboxChecked, setCheckboxChecked] = React.useState(false);

  const setConsentGiven = useSetAppStateValue('consentGiven');

  const handlePressTOS = React.useCallback(() => {
    console.warn('Implement handle press TOS');
  }, []);

  const handlePressPrivacyPolicy = React.useCallback(() => {
    console.warn('Implement handle press Privacy Policy');
  }, []);

  const handlePressContinue = React.useCallback(() => {
    // Set the consent given within the application state
    setConsentGiven(true);

    // Call the callback, if provided
    params?.onConsentAgree();
  }, []);

  return (
    <BottomUpModalWrapper goBack={goBack}>
      <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
      {/* <Typography.Body5>{t('description')}</Typography.Body5> */}

      <Spacer paddingVertical={20}>
        <ConsentButtonGroup
          handlePressTOS={handlePressTOS}
          handlePressPP={handlePressPrivacyPolicy}
        />
      </Spacer>

      <HStack mb="m">
        <Box mr="s" justifyContent="center">
          <CustomCheckbox
            handlePress={() => setCheckboxChecked(prev => !prev)}
            checked={checkboxChecked}
          />
        </Box>
        <Typography.Body5 style={CommonStyles.flex['1']}>{t('useDisclaimer')}</Typography.Body5>
      </HStack>

      <Button
        size={44}
        disabled={!checkboxChecked}
        backgroundColor={theme.colors.surfaceBlack}
        textColor={theme.colors.white}
        onPress={handlePressContinue}>
        {t('common:continue')}
      </Button>
    </BottomUpModalWrapper>
  );
};

export default ConsentAgreement;
