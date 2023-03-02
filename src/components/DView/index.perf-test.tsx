import React from 'react';
import { measurePerformance } from 'jest/utils/CustomWrappers';
import { Text, View } from 'react-native';
import DView from './index';

describe('Performance Test: DView', () => {
  it('basic render performance test', async () => {
    const dummyContents = (
      <View>
        <Text>Hello world</Text>
      </View>
    );

    await measurePerformance(<DView>{dummyContents}</DView>);
  });
});
