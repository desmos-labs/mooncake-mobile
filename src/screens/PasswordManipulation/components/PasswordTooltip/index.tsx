import React from 'react';
import {Image, View} from 'react-native';
import {check, validCheck} from 'assets/images';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = {
  label: string;

  isSatisfied: boolean;
};

const PasswordTooltip = ({label, isSatisfied}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.tooltipGroup}>
      <Image source={isSatisfied ? validCheck : check} style={styles.check} />
      <Typography.Caption1
        style={[styles.tooltipText, isSatisfied && styles.tooltipValid]}>
        {label}
      </Typography.Caption1>
    </View>
  );
};

export default PasswordTooltip;
