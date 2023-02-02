import React, { ComponentProps, FC } from 'react';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { Snackbar, Text } from 'react-native-paper';
import { View } from 'react-native';
import useStyles from './useStyles';

/* A React component that renders an error message. */
const Error: FC<{
  error: string;
  label: string;
  onPress: ComponentProps<typeof Button>['onPress'];
}> = ({ error, label, onPress }) => {
  const styles = useStyles();
  const { t } = useTranslation('followingAndFollowers');
  const [visible, setVisible] = React.useState(true);
  return (
    <Snackbar
      visible={visible}
      wrapperStyle={styles.wrapper}
      style={styles.errorContainer}
      duration={Number.POSITIVE_INFINITY}
      onDismiss={() => setVisible(false)}
      action={{
        label,
        labelStyle: styles.retryLabel,
        contentStyle: styles.retryContent,
        uppercase: false,
        onPress,
      }}>
      <View style={styles.errorMessage}>
        <Text style={styles.errorTitle}>{t('oops')}</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    </Snackbar>
  );
};

export default Error;
