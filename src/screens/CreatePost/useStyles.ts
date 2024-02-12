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
    paddingHorizontal: theme.spacings.m,
  },
  topBar: {
    alignItems: 'center',
  },
  postButton: {
    width: 61,
    height: 36,
  },
  contentContainer: {
    paddingVertical: theme.spacings.m,
    paddingHorizontal: theme.spacings.s,
  },
  avatarGroup: {
    alignSelf: 'flex-start',
    paddingTop: theme.spacings.s,
    marginRight: theme.spacings.m,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomPanel: {
    paddingHorizontal: theme.spacings.m,
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
    color: theme.colors.neutralVariants['900'],
    minHeight: 100,
  },
}));

export default useStyles;
