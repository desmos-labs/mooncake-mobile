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
  rightContainer: {flexDirection: 'row', alignItems: 'center'},
  divider: {
    borderColor: theme.colors.dividerGrey,
    borderWidth: 0.5,
    marginHorizontal: -30,
    marginVertical: 16,
  },
}));

export default useStyles;
