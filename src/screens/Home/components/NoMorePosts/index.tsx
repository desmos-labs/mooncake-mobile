import React from 'react';
import { makeStyle } from 'config/theme';
import { Image, View } from 'react-native';
import { noMorePosts } from 'assets/images';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';

const NoMorePosts = () => {
  const styles = useStyles();
  const { t } = useTranslation('home');

  return (
    <View style={styles.container}>
      <Image source={noMorePosts} style={styles.imageStyle} />
      <Typography.Body5 style={styles.textStyle}>{t('noMorePosts')}</Typography.Body5>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
    textAlign: 'center',
  },
  imageStyle: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
}));

export default NoMorePosts;
