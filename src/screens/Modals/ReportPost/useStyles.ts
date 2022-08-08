import {makeStyle} from 'config/theme';

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
  },
  messageInput: {
    minHeight: 80,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.lightGrey01,
  },
}));

export default useStyles;
