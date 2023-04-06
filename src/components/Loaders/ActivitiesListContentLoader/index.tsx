import React, { memo } from 'react';
import { Box, Skeleton, useTheme } from 'native-base';
import NotificationContentLoader from 'components/Loaders/NotificationContentLoader';

const HomePostListContentLoader = () => {
  const theme = useTheme();

  return (
    <Box flex={1} backgroundColor={theme.colors.white}>
      <Skeleton h="9px" w={110} rounded={theme.roundness} marginBottom="26px" />
      <NotificationContentLoader />
      <NotificationContentLoader />
      <NotificationContentLoader />
      <NotificationContentLoader />
      <NotificationContentLoader />
    </Box>
  );
};

export default memo(HomePostListContentLoader);
