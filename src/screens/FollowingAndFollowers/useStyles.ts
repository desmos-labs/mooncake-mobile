import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((numOfTabs: number, theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
  headerBackImage: {
    marginHorizontal: 8,
    padding: 12,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  tabBar: {
    margin: 0,
    marginBottom: 10,
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  tabBarItem: {
    margin: 0,
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 52,
  },
  tabBarLabel: {
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
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
