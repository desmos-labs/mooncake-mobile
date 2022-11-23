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
    marginTop: theme.spacing.l,
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
  tipButton: {minWidth: 106, borderColor: theme.colors.surfaceBlack},
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
}));

export default useStyles;
