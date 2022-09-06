import React from 'react';
import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/FormatUtils';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';

type Props = {
  count: number;

  label: string;
};

const SocialCounter = ({count, label}: Props) => {
  const theme = useTheme();
  return (
    <View style={{alignItems: 'center'}}>
      <Typography.H4 style={{color: theme.colors.butterOrange01}}>
        {formatNumShorthand(count)}
      </Typography.H4>
      <Typography.Caption1>{label}</Typography.Caption1>
    </View>
  );
};

export default SocialCounter;
