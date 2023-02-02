import { makeStyle } from 'config/theme';

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
    textAlign: 'center',
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.xl,
  },
  innerContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.l,
    // lazy override padding
    paddingTop: theme.spacing.s,
  },
  confirmButton: {
    backgroundColor: theme.colors.surfaceBlack,
    marginVertical: 40,
  },
}));

export default useStyles;
