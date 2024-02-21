import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  sceneContainerStyle: {
    backgroundColor: theme.colors.white,
  },
  topBar: {
    backgroundColor: theme.colors.white,
    zIndex: 2,
    paddingBottom: 10,
    paddingHorizontal: theme.spacings.m,
  },
  followIcon: {
    zIndex: 1,
    width: 24,
    height: 24,
    tintColor: theme.colors.neutralVariants['900'],
  },
  moreIcon: {
    width: 24,
    height: 24,
    marginLeft: theme.spacings.m,
  },
  middleTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: theme.spacings.s,
    minWidth: 160,
  },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },
  divider: {
    borderColor: theme.colors.neutralVariants['300'],
    borderWidth: 0.5,
    marginHorizontal: -30,
  },
  customTopBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacings.m,
    paddingVertical: theme.spacings.s,
  },
  customTopBarInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    color: theme.colors.neutralVariants['700'],
  },
}));

export default useStyles;
