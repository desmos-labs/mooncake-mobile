import React from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar, Text } from 'react-native-paper';
import { View } from 'react-native';
import useStyles from './useStyles';

export interface ErrorProps {
  /**
   * The error message to display.
   */
  readonly error: string;
  /**
   * The text to display on the button.
   */
  readonly buttonText: string;
  /**
   * The function to call when the button is pressed.
   */
  readonly onPress: () => void;
}

/**
 * Component that renders an error message.
 * @constructor
 */
const Error = (props: ErrorProps) => {
  const styles = useStyles();
  const { t } = useTranslation('followingAndFollowers');
  const [visible, setVisible] = React.useState(true);

  const { error, buttonText, onPress } = props;

  return (
    <Snackbar
      visible={visible}
      wrapperStyle={styles.wrapper}
      style={styles.errorContainer}
      duration={Number.POSITIVE_INFINITY}
      onDismiss={() => setVisible(false)}
      action={{
        label: buttonText,
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
