import React, { memo } from 'react';
import { Center, HStack, Skeleton, useTheme, VStack } from 'native-base';

const HomePostContentLoader = () => {
  const theme = useTheme();

  return (
    <Center marginTop={theme.spacing.s}>
      <HStack space="12px" rounded={theme.roundness} paddingX={theme.spacing.xs}>
        <Skeleton w="48px" h="48px" rounded="full" />
        <VStack space="1.5" flex={1}>
          <Skeleton width="200px" height="10px" mt="1" rounded={theme.roundness} />
          <Skeleton width="100px" height="8px" mt="1" rounded={theme.roundness} />
        </VStack>
      </HStack>
      <VStack space="1.5" alignSelf="flex-start" paddingX={theme.spacing.xs} marginTop="16px">
        <Skeleton width="350px" height="10px" mt="1" rounded={theme.roundness} />
        <Skeleton width="330px" height="10px" mt="1" rounded={theme.roundness} />
        <Skeleton width="200px" height="10px" mt="1" rounded={theme.roundness} />
      </VStack>
    </Center>
  );
};

export default memo(HomePostContentLoader);
