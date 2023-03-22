import React from 'react';
import { Divider, useTheme } from 'native-base';

// TODO: Marked for deletion
/**
 * A simple line for use as a separator in FlatLists
 */
const FlatListSeparator = () => {
  const theme = useTheme();

  return <Divider width="100%" height={1} backgroundColor={theme.colors.grey01} />;
};

export default FlatListSeparator;
