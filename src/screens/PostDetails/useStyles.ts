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
    paddingBottom: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
    flexGrow: 1,
  },
  followIcon: {
    zIndex: 1,
    width: 24,
    height: 24,
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
    borderColor: theme.colors.surfaceGrey,
    borderWidth: 1,
    marginHorizontal: -30,
  },
}));

export default useStyles;
