import { makeStyleWithProps } from 'config/theme';

const useStyles = makeStyleWithProps((numOfTabs: number, theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.m,
  },
  tabBar: {
    borderBottomWidth: 0,
    shadowOpacity: 0,
    marginBottom: 10,
    width: 250,
    backgroundColor: theme.colors.white,
  },
  tabBarItem: {
    margin: 0,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 52,
    justifyContent: 'flex-start',
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
    // tentative
    marginLeft: 23,
  },
}));

export default useStyles;
