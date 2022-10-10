import React from 'react';
import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/FormatUtils';
import {ActivityIndicator, View} from 'react-native';
import {useTheme} from 'react-native-paper';

type Props = {
  count?: number;

  label: string;
};

const SocialCounter = ({count, label}: Props) => {
  const theme = useTheme();
  return (
    <View style={{alignItems: 'center'}}>
      {count || count === 0 ? (
        <Typography.H4 style={{color: theme.colors.butterOrange01}}>
          {formatNumShorthand(count)}
        </Typography.H4>
      ) : (
        <ActivityIndicator color={theme.colors.primary} />
      )}
      <Typography.Caption1>{label}</Typography.Caption1>
    </View>
  );
};

export default SocialCounter;
