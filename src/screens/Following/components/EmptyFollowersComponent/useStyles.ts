import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

const useStyles = () => {
  const theme = useTheme();
  const view: StyleProp<ViewStyle> = {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 140,
  };
  const image: StyleProp<ImageStyle> = {
    width: 230,
    height: 116,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  };
  const subtitle1: StyleProp<TextStyle> = {
    width: '100%',
    textAlign: 'center',
  };
  return {view, image, subtitle1};
};

export default useStyles;
