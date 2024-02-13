import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { makeStyle } from 'config/theme';
import React from 'react';
import { View } from 'react-native';

type Props = {
  label: string;
};

const PasswordTooltip = ({ label }: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.tooltipGroup}>
      <AntDesign
        name="exclamationcircleo"
        size={19}
        color={theme.colors.feedback.error}
        style={styles.icon}
      />
      <Typography.Regular14 style={[styles.tooltipText]}>{label}</Typography.Regular14>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  tooltipGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: theme.spacings.s,
  },
  check: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacings.xs,
  },
  tooltipText: {
    color: theme.colors.feedback.error,
    marginLeft: 6,
  },
  icon: {
    marginTop: 2,
  },
}));

export default PasswordTooltip;
