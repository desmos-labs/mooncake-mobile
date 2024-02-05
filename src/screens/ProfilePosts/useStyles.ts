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
    elevation: 0,
    marginBottom: 10,
    width: 180,
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
    marginBottom: 8,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'left',
    textTransform: 'none',
  },
  tabBarIndicator: {
    backgroundColor: theme.colors.surfaceBlack,
    width: 28,
    height: 2,
    borderRadius: 4,
    marginLeft: 9,
  },
}));

export default useStyles;
