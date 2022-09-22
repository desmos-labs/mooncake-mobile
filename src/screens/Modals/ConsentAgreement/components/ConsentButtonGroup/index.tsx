import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {arrowRight} from 'assets/images';
import useStyles from './useStyles';

type Props = {
  /**
   * What to do when the Terms of Service button is pressed
   */
  handlePressTOS: () => void;

  /**
   * What to do when the Privacy Policy button is pressed
   */
  handlePressPP: () => void;
};

const ConsentButtonGroup = ({handlePressTOS, handlePressPP}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressTOS} style={styles.buttonGroup}>
        <Typography.Body5>{t('common:termsOfUse')}</Typography.Body5>

        <Image source={arrowRight} style={styles.arrowRight} />
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity onPress={handlePressPP} style={styles.buttonGroup}>
        <Typography.Body5>{t('common:privacyPolicy')}</Typography.Body5>

        <Image source={arrowRight} style={styles.arrowRight} />
      </TouchableOpacity>
    </View>
  );
};

export default ConsentButtonGroup;
