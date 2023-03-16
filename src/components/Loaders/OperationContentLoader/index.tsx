import React, { memo } from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { Dimensions } from 'react-native';
import { useTheme } from 'native-base';

const OperationContentLoader = () => {
  const theme = useTheme();

  return (
    <ContentLoader
      animate={true}
      speed={2}
      width={Dimensions.get('window').width - 32}
      height={166}
      backgroundColor={theme.colors.surfaceGrey}
      foregroundColor={theme.colors.background}>
      <Rect x="50" y="4" rx="3" ry="3" width="170" height="7" />
      <Rect x="50" y="18" rx="3" ry="3" width="130" height="7" />
      <Rect x="50" y="32" rx="3" ry="3" width="90" height="7" />
      <Circle cx="22" cy="22" r="20" />
    </ContentLoader>
  );
};

export default memo(OperationContentLoader);
