import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((numOfTabs: number, theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  navigationBar: {
    marginTop: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  backButton: {
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
  },
  header: {
    textAlign: 'center',
    flexGrow: 1,
    paddingRight: 74,
    fontWeight: '700',
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
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 52,
  },
  tabBarLabel: {
    marginBottom: 10,
    backgroundColor: 'transparent',
    fontSize: 15,
    fontWeight: '600',
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
