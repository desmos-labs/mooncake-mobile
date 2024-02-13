import { useTheme } from '@react-navigation/native';
import Spacer from 'components/Spacer';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { View } from 'react-native';

const HomePostContentLoader = () => {
  const theme = useTheme();

  return (
    <Spacer paddingBottom="m" paddingVertical="m">
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Skeleton height={40} width={40} radius="round" colorMode={theme.dark ? 'dark' : 'light'} />
        <View style={{ flex: 1, gap: 8, marginTop: 4 }}>
          <Skeleton height={14} width={200} colorMode={theme.dark ? 'dark' : 'light'} />
          <Skeleton height={14} width={140} colorMode={theme.dark ? 'dark' : 'light'} />
        </View>
      </View>
      <Spacer paddingBottom="l" />
      <Spacer paddingLeft={46}>
        <Skeleton height={14} width={260} colorMode={theme.dark ? 'dark' : 'light'} />
      </Spacer>
    </Spacer>
  );
};

export default HomePostContentLoader;
