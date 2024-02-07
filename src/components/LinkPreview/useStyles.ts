import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

const useStyles = makeStyle(theme => {
  const screenDimensions = Dimensions.get('window');
  const imageWidth = screenDimensions.width - 32;
  const imageHeight = (imageWidth * 9) / 16;

  return {
    containerStyle: {
      width: imageWidth,
      height: imageHeight,
    },
    previewImage: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      backgroundColor: theme.colors.neutral['300'],
    },
    text: {
      position: 'absolute',
      bottom: 5,
      left: 5,
      color: theme.colors.white,
      backgroundColor: theme.colors.overlay,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 12,
    },
  };
});

export default useStyles;
