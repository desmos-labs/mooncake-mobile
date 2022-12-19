import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.l,
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
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    paddingTop: 10,
  },
  messageInput: {
    height: 80,
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.lightGrey01,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.lightGrey01,
  },
}));

export default useStyles;
