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
    textAlign: 'left',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.s,
    alignSelf: 'center',
  },
  innerContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    paddingTop: 10,
  },
  divider: {
    borderColor: theme.colors.dividerGrey,
    borderWidth: 0.5,
    marginHorizontal: -theme.spacing.l,
  },
  image: { width: 24, height: 24, marginRight: theme.spacing.m },
  button: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.l,
    alignItems: 'center',
  },
}));

export default useStyles;
