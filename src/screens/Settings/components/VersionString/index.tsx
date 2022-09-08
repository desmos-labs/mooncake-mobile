import React from 'react';
import {StyleSheet} from 'react-native';
import Typography from 'components/Typography';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getVersion} from 'react-native-device-info';

const VersionString = () => {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Typography.Body7 style={styles.textStyle}>
        Version {getVersion()}
      </Typography.Body7>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
  },
  textStyle: {
    color: 'black',
  },
});

export default VersionString;
