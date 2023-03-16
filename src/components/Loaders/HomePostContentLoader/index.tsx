import React, { memo } from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { Dimensions } from 'react-native';
import { useTheme } from 'native-base';

const HomePostContentLoader = () => {
  const theme = useTheme();

  return (
    <ContentLoader
      animate={true}
      speed={2}
      width={Dimensions.get('window').width - 32}
      height={166}
      backgroundColor={theme.colors.surfaceGrey}
      foregroundColor={theme.colors.background}>
      <Rect x="64" y="18" rx="3" ry="3" width="88" height="8" />
      <Rect x="64" y="38" rx="3" ry="3" width="110" height="8" />
      <Rect x="6" y="66" rx="3" ry="3" width="320" height="8" />
      <Rect x="6" y="86" rx="3" ry="3" width="280" height="8" />
      <Rect x="6" y="106" rx="3" ry="3" width="330" height="8" />
      <Circle cx="30" cy="30" r="25" />
    </ContentLoader>
  );
};

export default memo(HomePostContentLoader);
