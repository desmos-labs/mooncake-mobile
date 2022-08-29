import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

const useStyles = () => {
  const theme = useTheme();
  const container: StyleProp<ViewStyle> = {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  };
  const navigationBar: StyleProp<ViewStyle> = {
    marginTop: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  };
  const backButton: ViewStyle | TextStyle = {
    color: theme.colors.text,
    backgroundColor: 'transparent',
    flexGrow: 0,
    margin: 0,
    padding: 0,
    marginLeft: 13,
    marginRight: 13,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  };
  const header: StyleProp<TextStyle> = {
    textAlign: 'center',
    flexGrow: 1,
    paddingRight: 74,
    fontWeight: '700',
  };
  return {container, navigationBar, backButton, header};
};

export default useStyles;
