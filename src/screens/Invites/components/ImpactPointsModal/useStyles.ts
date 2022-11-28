import {makeStyle} from 'config/theme';

/**
 * Style hook for the ResultModal screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tabIcon: {
    width: 44,
    height: 4,
    borderRadius: 4,
    // this is a different gray as the gray used in design is not
    // in the theme colors
    backgroundColor: theme.colors.iconGrey,
    alignSelf: 'center',
  },
  headerText: {
    textAlign: 'left',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.s,
    alignSelf: 'center',
  },
  innerContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    paddingTop: 10,
  },
  tableLeft: {
    borderRightWidth: 0,
    padding: 14,
    flex: 0.5,
    borderWidth: 1,
    flexGrow: 1,
    borderColor: '#EFEFEF',
  },
  tableRight: {
    flex: 0.5,
    borderWidth: 1,
    flexGrow: 1,
    padding: 14,
    borderColor: '#EFEFEF',
  },
}));

export default useStyles;
