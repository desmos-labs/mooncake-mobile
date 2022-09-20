import CustomSnackbar from 'components/CustomSnackbarGroup/components/CustomSnackbar';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {ResultTransaction} from 'types/transaction';
import useStyles from './useStyles';

interface Props {
  transactions: ResultTransaction[];
  onHide: (hash: string) => void;
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

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);

  return (
    <View style={styles.absolutePositionedWrapper}>
      {transactions.map(value => {
        return (
          <CustomSnackbar
            label={
              value.result.type === 'transaction_success' ? 'success' : 'failed'
            }
            key={value.hash}
            onHide={() => onHide(value.hash)}
            onSwipeUp={() => onHide(value.hash)}
            autoHide={autoHide}
            autoHideMs={autoHideMs}
          />
        );
      })}
    </View>
  );
};

export default CustomSnackbarGroup;
