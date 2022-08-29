import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

const useStyles = (numOfTabs: number) => {
  const theme = useTheme();
  const activeColor: string = theme.colors.text;
  const inactiveColor: string = theme.colors.grey01;
  const tabBar: StyleProp<ViewStyle> = {
    margin: 0,
    marginBottom: 10,
    padding: 0,
    backgroundColor: 'transparent',
  };
  const tabBarTab: StyleProp<ViewStyle> = {
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
  const tabBarIndicator: StyleProp<TextStyle> = {
    backgroundColor: theme.colors.primary,
    width: 4,
    maxWidth: 4,
    height: 4,
    maxHeight: 4,
    borderRadius: 4,
    marginLeft: `${100 / numOfTabs / 2}%`,
  };
  return {
    activeColor,
    inactiveColor,
    tabBar,
    tabBarTab,
    tabBarLabel,
    tabBarIndicator,
  };
};

export default useStyles;
