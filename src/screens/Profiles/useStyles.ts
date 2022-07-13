import {makeStyle} from 'config/theme';

/**
 * Style hook for the Settings screen
 */
const useStyles = makeStyle(theme => ({
  root: {
    padding: theme.spacing.m,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginBottom: 20,
  },
  signOutButton: {
    marginTop: theme.spacing.l,
  },
  scrollViewOuter: {margin: -20},
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
  plusButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
  },
  plusButtonIcon: {
    alignSelf: 'center',
  },
}));

export default useStyles;
