import Button from 'components/Button';
import Typography from 'components/Typography';
import React from 'react';
import {View} from 'react-native';

import useStyles from './useStyles';

export interface Props {
  type: 'success' | 'failure';
  toast: any;
}

const CustomToast = ({type, toast}: Props): JSX.Element => {
  const styles = useStyles({type, toast});

  return (
    <View style={styles.commonToastStyle}>
      <Typography.Body6 style={{alignSelf: 'center'}}>
        {toast.message}
      </Typography.Body6>
      {type === 'failure' ? (
        <Button style={styles.button} mode="text" onPress={toast.onPress}>
          <Typography.Subtitle3>Retry</Typography.Subtitle3>
        </Button>
      ) : null}
    </View>
  );
};

export default CustomToast;
