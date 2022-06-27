import React from 'react';
import {View, Text} from 'react-native';
import EnvConfig from 'config/EnvConfig';

const Landing = () => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Landing Page</Text>
      <Text>Config: {EnvConfig.MMKV_ID}</Text>
    </View>
  );
};

export default Landing;
