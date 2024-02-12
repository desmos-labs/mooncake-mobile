import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import BCheckbox from 'components/BCheckbox';
import { CheckboxProps } from 'expo-checkbox/src/Checkbox.types';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Trans } from 'react-i18next';
import { View } from 'react-native';
import useOpenTermsAndConditions from 'hooks/urls/useOpenTermsAndConditions';
import useOpenPrivacyPolicy from 'hooks/urls/useOpenPrivacyPolicy';
import useStyles from './useStyles';

/**
 * View that represents a checkbox with the terms of service and privacy policy.
 * @constructor
 */
const LandingCheckbox = ({ onValueChange, ...rest }: CheckboxProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const openTermsAndConditions = useOpenTermsAndConditions();
  const openPrivacyPolicy = useOpenPrivacyPolicy();

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
      <Typography.Regular14 style={styles.mainTextColor}>
        <Trans
          i18nKey="tos and privacy"
          ns="legal"
          components={[
            <Typography.Regular14
              onPress={openTermsAndConditions}
              style={{ color: theme.colors.primary }}
            />,
            <Typography.Regular14
              onPress={openPrivacyPolicy}
              style={{ color: theme.colors.primary }}
            />,
          ]}
        />
      </Typography.Regular14>
    </View>
  );
};

export default LandingCheckbox;
