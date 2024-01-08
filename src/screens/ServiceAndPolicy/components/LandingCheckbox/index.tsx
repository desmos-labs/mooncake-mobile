import BCheckbox from 'components/BCheckbox';
import Typography from 'components/Typography';
import { CheckboxProps } from 'expo-checkbox/src/Checkbox.types';
import * as Haptics from 'expo-haptics';
import { useTheme } from 'native-base';
import React from 'react';
import { Trans } from 'react-i18next';
import { Linking, View } from 'react-native';
import useStyles from './useStyles';

const LandingCheckbox = ({ onValueChange, ...rest }: CheckboxProps) => {
  const styles = useStyles();
  const theme = useTheme();

  /**
   * Function to handle the checkbox value change with haptic feedback
   * @param value
   */
  const onValueChangeWithFeedbackWrapper = async (value: boolean) => {
    if (onValueChange) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onValueChange(value);
    }
  };

  return (
    <View style={styles.root}>
      <BCheckbox
        style={styles.checkbox}
        onValueChange={value => onValueChangeWithFeedbackWrapper(value)}
        {...rest}
      />
      <Typography.Body6 style={styles.mainTextColor}>
        <Trans
          i18nKey="tos and privacy"
          ns="legal"
          components={[
            <Typography.Body6
              onPress={() => Linking.openURL('https://butter.social/terms-and-conditions')}
              style={{ color: theme.colors.primary }}
            />,
            <Typography.Body6
              onPress={() => Linking.openURL('https://butter.social/privacy-policy')}
              style={{ color: theme.colors.primary }}
            />,
          ]}
        />
      </Typography.Body6>
    </View>
  );
};

export default LandingCheckbox;
