import Typography from 'components/Typography';
import React from 'react';
import {View} from 'react-native';
import useStyles from './useStyles';

export const TippedTab = () => {
  const styles = useStyles();

  return (
    <View style={styles.contentContainer}>
      <Typography.H3>Coming soon</Typography.H3>
    </View>
  );
};

export default TippedTab;
