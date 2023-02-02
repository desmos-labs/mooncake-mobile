import React from 'react';
import { Image, View } from 'react-native';
import { check, validCheck } from 'assets/images';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';

type Props = {
  label: string;

  isSatisfied: boolean;
};

const PasswordTooltip = ({ label, isSatisfied }: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.tooltipGroup}>
      <Image source={isSatisfied ? validCheck : check} style={styles.check} />
      <Typography.Caption1 style={[styles.tooltipText, isSatisfied && styles.tooltipValid]}>
        {label}
      </Typography.Caption1>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  tooltipGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  check: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacing.xs,
  },
  tooltipValid: {
    color: theme.colors.accentGreen01,
  },
  tooltipText: {
    color: theme.colors.grey02,
  },
}));

export default PasswordTooltip;
