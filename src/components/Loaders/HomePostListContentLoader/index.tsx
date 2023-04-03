import React, { memo } from 'react';
import { Box, Skeleton, useTheme } from 'native-base';
import HomePostContentLoader from '../HomePostContentLoader';

const HomePostListContentLoader = () => {
  const theme = useTheme();

  return (
    <Box flex={1} backgroundColor={theme.colors.white}>
      <HomePostContentLoader />
      <Skeleton marginTop={theme.spacing.s} width="1000" height="1px" />
      <HomePostContentLoader />
      <Skeleton marginTop={theme.spacing.s} width="1000" height="1px" />
      <HomePostContentLoader />
    </Box>
  );
};

export default memo(HomePostListContentLoader);
