import React from 'react';
import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/formatUtils';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Spacer from 'components/Spacer';

type Props = {
  count: number;

  label: string;
};

const SocialCounter = ({count, label}: Props) => {
  const theme = useTheme();
  return (
    <View style={{alignItems: 'center'}}>
      <Typography.H4 style={{color: theme.colors.primary}}>
        {formatNumShorthand(count)}
      </Typography.H4>
      <Spacer paddingTop={theme.spacing.s}>
        <Typography.Caption1>{label}</Typography.Caption1>
      </Spacer>
    </View>
  );
};

export default SocialCounter;
