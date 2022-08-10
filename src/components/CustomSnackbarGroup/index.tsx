import CustomSnackbar from 'components/CustomSnackbar';
import React from 'react';
import {View} from 'react-native';

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
  return (
    <View style={{position: 'absolute', right: 0, left: 0, top: 10}}>
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
