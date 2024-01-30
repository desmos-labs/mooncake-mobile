import { makeStyle } from 'config/theme';

/**
 * Style hook for the EnterComment screen.
 */
const useStyles = makeStyle(theme => ({
  root: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  topBar: {
    alignItems: 'center',
  },
  postButton: {
    width: 61,
    height: 36,
  },
  contentContainer: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
  },
  avatarGroup: {
    alignSelf: 'flex-start',
    paddingTop: theme.spacing.s,
    marginRight: theme.spacing.m,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomPanel: {
    paddingHorizontal: theme.spacing.m,
  },
  postButtonText: {
    color: theme.colors.white,
  },
  input: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
    color: theme.colors.surfaceBlack,
    minHeight: 100,
  },
}));

export default useStyles;
