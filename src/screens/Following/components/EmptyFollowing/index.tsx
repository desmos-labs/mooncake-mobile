import React from 'react';
import Typography from 'components/Typography';
import {Image, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {errorImage} from 'assets/images';
import useStyles from './useStyles';

const Empty = () => {
  const {t} = useTranslation('followingAndFollowers');
  const styles = useStyles();

  return (
    <View style={styles.view}>
      <Image style={styles.image} source={errorImage} />

      <Typography.Subtitle1 style={styles.subtitle1}>
        {t('noFollowingDTags')}
      </Typography.Subtitle1>
    </View>
  );
};

export default Empty;
