import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

const useStyles = (numOfTabs: number) => {
  const theme = useTheme();
  const container: StyleProp<ViewStyle> = {
    flexGrow: 1,
    backgroundColor: 'transparent',
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
  const tabBar: StyleProp<ViewStyle> = {
    margin: 0,
    marginBottom: 10,
    padding: 0,
    backgroundColor: 'transparent',
  };
  const tabBarItem: StyleProp<ViewStyle> = {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 52,
  };
  const tabBarLabel: StyleProp<TextStyle> = {
    marginBottom: 10,
    backgroundColor: 'transparent',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'none',
  };
  const activeTintColor: string = theme.colors.text;
  const inactiveTintColor: string = theme.colors.grey01;
  const tabBarIndicator: TextStyle = {
    backgroundColor: theme.colors.primary,
    width: 4,
    maxWidth: 4,
    height: 4,
    maxHeight: 4,
    borderRadius: 4,
    marginLeft: `${100 / numOfTabs / 2}%`,
  };
  return {
    container,
    navigationBar,
    backButton,
    header,
    tabBar,
    tabBarItem,
    tabBarLabel,
    activeTintColor,
    inactiveTintColor,
    tabBarIndicator,
  };
};

export default useStyles;
