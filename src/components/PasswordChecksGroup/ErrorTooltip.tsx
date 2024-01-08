import { AntDesign } from '@expo/vector-icons';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import { useTheme } from 'native-base';
import React from 'react';
import { View } from 'react-native';

type Props = {
  label: string;
};

const ErrorTooltip = ({ label }: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.tooltipGroup}>
      <AntDesign name="exclamationcircleo" size={19} color={theme.colors.pink01} />
      <Typography.Body5 style={[styles.tooltipText]}>{label}</Typography.Body5>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  tooltipGroup: {
    flexDirection: 'row',
    alignItems: 'center',
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
}));

export default ErrorTooltip;
