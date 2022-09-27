import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((numOfTabs: number, theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },
  tabBar: {
    margin: 0,
    marginBottom: 10,
    padding: 0,
    backgroundColor: 'transparent',
  },
  tabBarItem: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 52,
  },
  tabContainerStyle: {
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: 0.15,
    textAlign: 'left',
    textTransform: 'none',
  },
  tabBarIndicator: {
    backgroundColor: theme.colors.primary,
    width: 4,
    maxWidth: 4,
    height: 4,
    maxHeight: 4,
    borderRadius: 4,
    marginLeft: `${100 / numOfTabs / 2}%`,
  },
}));

export default useStyles;
