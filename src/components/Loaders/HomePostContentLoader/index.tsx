import { useTheme } from '@react-navigation/native';
import Spacer from 'components/Spacer';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { View } from 'react-native';

const HomePostContentLoader = () => {
  const theme = useTheme();

  return (
    <Spacer paddingHorizontal="m" paddingVertical="m">
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Skeleton height={48} width={48} radius="round" colorMode={theme.dark ? 'dark' : 'light'} />
        <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
          <Skeleton height={14} width={140} colorMode={theme.dark ? 'dark' : 'light'} />
          <Skeleton height={14} width={250} colorMode={theme.dark ? 'dark' : 'light'} />
        </View>
      </View>
      <Spacer paddingBottom="s" />
      <Skeleton height={16} width={360} colorMode={theme.dark ? 'dark' : 'light'} />
      <Spacer paddingBottom="s" />
      <Skeleton height={16} width={340} colorMode={theme.dark ? 'dark' : 'light'} />
    </Spacer>
  );
};

export default HomePostContentLoader;
