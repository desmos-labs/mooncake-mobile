import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  sceneContainerStyle: {
    backgroundColor: theme.colors.white,
  },
  topBar: {
    backgroundColor: theme.colors.white,
    zIndex: 2,
    paddingBottom: 10,
  },
  followIcon: {
    zIndex: 1,
    width: 24,
    height: 24,
    tintColor: theme.colors.surfaceBlack,
  },
  moreIcon: {
    width: 24,
    height: 24,
    marginLeft: theme.spacing.m,
  },
  middleTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: theme.spacing.s,
    minWidth: 160,
  },
  rightContainer: { flexDirection: 'row', alignItems: 'center' },
  divider: {
    borderColor: theme.colors.dividerGrey,
    borderWidth: 0.5,
    marginHorizontal: -30,
  },
  customTopBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  customTopBarInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
