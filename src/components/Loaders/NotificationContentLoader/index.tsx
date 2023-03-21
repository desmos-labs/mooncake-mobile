import React, { memo } from 'react';
import { HStack, Skeleton, useTheme, VStack } from 'native-base';
import Spacer from 'components/Spacer';

const NotificationContentLoader = () => {
  const theme = useTheme();

  return (
    <>
      <HStack>
        <Skeleton h={10} w={10} rounded={80} />
        <VStack>
          <Skeleton marginLeft={2} marginTop={2} h={2} w={250} rounded={theme.roundness} />
          <Skeleton marginLeft={2} marginTop={2} h={2} w={100} rounded={theme.roundness} />
        </VStack>
      </HStack>
      <Spacer paddingTop={theme.spacing.m} />
      <HStack>
        <Skeleton h={10} w={10} rounded={80} />
        <VStack>
          <Skeleton marginLeft={2} marginTop={2} h={2} w={230} rounded={theme.roundness} />
          <Skeleton marginLeft={2} marginTop={2} h={2} w={90} rounded={theme.roundness} />
        </VStack>
      </HStack>
      <Spacer paddingTop={theme.spacing.m} />
      <HStack>
        <Skeleton h={10} w={10} rounded={80} />
        <VStack>
          <Skeleton marginLeft={2} marginTop={2} h={2} w={140} rounded={theme.roundness} />
          <Skeleton marginLeft={2} marginTop={2} h={2} w={50} rounded={theme.roundness} />
        </VStack>
      </HStack>
    </>
  );
};

export default memo(NotificationContentLoader);
