import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { AntDesign } from '@expo/vector-icons';
import { makeStyle } from 'config/theme';
import { useTheme } from 'native-base';
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
        color={theme.colors.pink01}
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
    marginVertical: theme.spacing.s,
  },
  check: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacing.xs,
  },
  tooltipText: {
    color: theme.colors.pink01,
    marginLeft: 6,
  },
  icon: {
    marginTop: 2,
  },
}));

export default PasswordTooltip;
