import { makeStyleWithProps } from 'config/theme';

interface StyleProps {
  shouldDisableTipButton: boolean;
}

const useStyles = makeStyleWithProps((props: StyleProps, theme) => ({
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
    marginTop: 10,
  },
  headerText: {
    textAlign: 'center',
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.m,
  },
  innerContainer: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.lightGrey01,
  },
  messageInput: {
    minHeight: 80,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  contentContainer: {
    padding: theme.spacing.l,
    paddingTop: 0,
  },
  loadingView: {
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  spinner: {
    left: 0,
    marginRight: 'auto',
  },
  amountErrorText: {
    marginTop: 6,
    color: theme.colors.pink01,
  },
}));

export default useStyles;
