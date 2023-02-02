import Typography from 'components/Typography';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

export interface Props {
  roundTop?: boolean;
  roundBottom?: boolean;
  header: string;
  body: string;
  number: number;
}

const SingleProperty = ({ header, body, number, roundBottom, roundTop }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <View
      style={[
        styles.buttonContainer,
        roundTop && {
          borderTopLeftRadius: theme.roundness,
          borderTopRightRadius: theme.roundness,
        },
        roundBottom && {
          borderBottomLeftRadius: theme.roundness,
          borderBottomRightRadius: theme.roundness,
        },
      ]}>
      <View style={styles.textGroup}>
        <Typography.Subtitle4 style={{ color: theme.colors.midGrey }} numberOfLines={1}>
          {header}
        </Typography.Subtitle4>
        <Typography.Body7 style={{ color: theme.colors.butterOrange01 }}>{body}</Typography.Body7>
      </View>
      <View style={styles.textGroup}>
        <Typography.Body6 style={{ color: theme.colors.midGrey }}>{number}%</Typography.Body6>
      </View>
    </View>
  );
};

export default SingleProperty;
