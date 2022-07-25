import React from 'react';
import {useTranslation} from 'react-i18next';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {Image, View} from 'react-native';
import Button from 'components/Button';
import {errorImage} from 'assets/images';
import useStyles from './useStyles';

const NoDtagFound = () => {
  const {t} = useTranslation('noDtagFound');
  const styles = useStyles();

  const handlePress = React.useCallback(() => {
    // implementation
  }, []);

  return (
    <DView style={styles.container}>
      <Image source={errorImage} style={styles.image} />
      <View style={styles.textGroup}>
        <Typography.H4 style={styles.headerText}>{t('header')}</Typography.H4>
        <Typography.Body6 style={styles.descriptionText}>
          {t('description')}
        </Typography.Body6>
      </View>

      <Button onPress={handlePress} mode="gradientFilled">
        {t('createDesmosProfile')}
      </Button>
    </DView>
  );
};

export default NoDtagFound;
