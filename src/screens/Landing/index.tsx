import DView from 'components/DView';
import React from 'react';
import {Text} from 'react-native';
import EnvConfig from 'config/EnvConfig';

const Landing = () => {
  return (
    <DView
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Landing Page</Text>
      <Text>Config: {EnvConfig.MMKV_ID}</Text>
    </DView>
  );
};

export default Landing;
