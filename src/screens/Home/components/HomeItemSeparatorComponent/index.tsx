import React from 'react';
import { Box, useTheme } from 'native-base';

const HomeItemSeparatorComponent = () => {
  const theme = useTheme();

  return (
    <Box
      height="1px"
      style={{
        paddingHorizontal: -theme.spacing.l,
        backgroundColor: theme.colors.dividerGrey,
        marginVertical: theme.spacing.m,
      }}
    />
  );
};

export default HomeItemSeparatorComponent;
