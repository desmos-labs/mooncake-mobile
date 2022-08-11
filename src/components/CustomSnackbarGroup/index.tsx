import CustomSnackbar from 'components/CustomSnackbarGroup/components/CustomSnackbar';
import React from 'react';
import {View} from 'react-native';
import useStyles from './useStyles';

interface Props {
  transactions: {label: string}[];
  onHide: () => void;
  autoHide: boolean;
  autoHideMs: number;
}

const CustomSnackbarGroup = ({
  transactions,
  onHide,
  autoHide,
  autoHideMs,
}: Props): JSX.Element => {
  const styles = useStyles();
  return (
    <View style={styles.absolutePositionedWrapper}>
      {transactions.map(value => {
        return (
          <CustomSnackbar
            label={value.label}
            key={value.label}
            onHide={onHide}
            onSwipeUp={onHide}
            autoHide={autoHide}
            autoHideMs={autoHideMs}
          />
        );
      })}
    </View>
  );
};

export default CustomSnackbarGroup;
