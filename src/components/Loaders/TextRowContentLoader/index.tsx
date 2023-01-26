import React, {memo} from 'react';
import ContentLoader, {Rect} from 'react-content-loader/native';
import {Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';

const TextRowContentLoader = ({width}: {width: string}) => {
  const theme = useTheme();

  return (
    <ContentLoader
      animate={true}
      speed={2}
      width={Dimensions.get('window').width - 32}
      height={14}
      backgroundColor={theme.colors.surfaceGrey}
      foregroundColor={theme.colors.background}>
      <Rect x="0" y="4" rx="3" ry="3" width={width} height="7" />
    </ContentLoader>
  );
};

export default memo(TextRowContentLoader);
