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
    backgroundColor: theme.colors.neutralVariants['300'],
    alignSelf: 'center',
  },
  headerText: {
    textAlign: 'center',
    marginBottom: theme.spacings.m,
    marginTop: theme.spacings.xl,
  },
  innerContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: theme.spacings.l,
    paddingBottom: theme.spacings.l,
    paddingTop: 10,
  },
  messageInput: {
    height: 120,
    paddingTop: theme.spacings.s,
    paddingBottom: theme.spacings.s,
    verticalAlign: 'top',
  },
  textInput: {
    borderColor: theme.colors.neutralVariants['600'],
  },
  loadingView: {
    alignItems: 'center',
    paddingVertical: theme.spacings.m,
  },
  successfulReport: {
    alignItems: 'center',
    paddingVertical: 70,
  },
  reportIcon: {
    width: 121,
    height: 121,
  },
  reportSuccessText: {
    textAlign: 'center',
  },
}));

export default useStyles;
