import React, {memo} from 'react';
import ContentLoader, {Circle, Rect} from 'react-content-loader/native';
import {Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';

const NotificationContentLoader = () => {
  const theme = useTheme();

  return (
    <ContentLoader
      animate={true}
      speed={2}
      width={Dimensions.get('window').width - 32}
      height={166}
      backgroundColor={theme.colors.surfaceGrey}
      foregroundColor={theme.colors.background}>
      <Rect x="50" y="8" rx="3" ry="3" width="200" height="8" />
      <Rect x="50" y="24" rx="3" ry="3" width="110" height="8" />
      <Circle cx="22" cy="22" r="20" />
    </ContentLoader>
  );
};

export default memo(NotificationContentLoader);
