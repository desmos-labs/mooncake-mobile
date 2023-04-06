import React, { memo } from 'react';
import { Center, HStack, Skeleton, useTheme, VStack } from 'native-base';

const NotificationContentLoader = () => {
  const theme = useTheme();

  return (
    <Center marginBottom="32px" paddingBottom="32px">
      <HStack space="12px" rounded={theme.roundness}>
        <Skeleton w="40px" h="40px" rounded="full" />
        <VStack space="1.5" flex={1}>
          <Skeleton width="200px" height="9px" mt="1" rounded={theme.roundness} />
          <Skeleton width="100px" height="7px" mt="1" rounded={theme.roundness} />
        </VStack>
        <Skeleton w="48px" h="48px" rounded={4} />
      </HStack>
    </Center>
  );
};

export default memo(NotificationContentLoader);
