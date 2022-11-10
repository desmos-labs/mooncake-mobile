/**
 * Style hook for the ChangePassword screen
 */
import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    backgroundColor: theme.colors.white,
  },
  sceneContainerStyle: {
    backgroundColor: theme.colors.white,
  },
  topBar: {
    backgroundColor: theme.colors.white,
    zIndex: 2,
    paddingBottom: 10,
  },
  flatListContainer: {
    paddingHorizontal: theme.spacing.m,
    flexGrow: 1,
  },
  followIcon: {
    zIndex: 1,
    width: 36,
    height: 36,
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
  rightContainer: {flexDirection: 'row', alignItems: 'center'},
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
