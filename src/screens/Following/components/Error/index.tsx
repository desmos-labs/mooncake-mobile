import React, {ComponentProps, FC} from 'react';
import {Text, View} from 'react-native';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';
import {ApolloError} from '@apollo/client';
import useStyles from './useStyles';

/* A React component that renders an error message. */
const Error: FC<{
  error: ApolloError;
  onPress: ComponentProps<typeof Button>['onPress'];
}> = ({error, onPress}) => {
  const styles = useStyles();
  const {t} = useTranslation('followersAndFollowers');
  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorMessage}>
        <Text style={styles.errorTitle}>{t('oops')}</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
      <Button onPress={onPress}>{t('retry')}</Button>
    </View>
  );
};

export default Error;
