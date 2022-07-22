import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Button from 'components/Button';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';
import {useNavigation} from '@react-navigation/native';
import ConsentButtonGroup from './components/ConsentButtonGroup';
import useStyles from './useStyles';

const ConsentAgreement = () => {
  const {t} = useTranslation('consentAgreement');
  const styles = useStyles();

  const {goBack} = useNavigation();

  const handlePressTOS = React.useCallback(() => {
    // implementation
  }, []);

  const handlePressPP = React.useCallback(() => {
    // implementation
  }, []);

  const handlePressContinue = React.useCallback(() => {
    // implementation
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

        <Spacer paddingVertical={40}>
          <Button mode="gradientFilled" onPress={handlePressContinue}>
            {t('common:continue')}
          </Button>
        </Spacer>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ConsentAgreement;
