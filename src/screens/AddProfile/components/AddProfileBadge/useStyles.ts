import { makeStyle } from 'config/theme';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  externalContainer: {
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    marginBottom: 16,
  },
  externalContainerDisabled: {
    opacity: 0.6,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: 16,
    paddingVertical: 19,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  textContainer: {
    alignSelf: 'center',
    flexGlows: 1,
    flexShrink: 1,
    flexBasis: '100%',
    marginHorizontal: 12,
  },
  radioButton: {
    alignSelf: 'center',
    flexGlows: 0,
    flexShrink: 0,
    flexBasis: 40,
  },
  radioButtonDisabled: {
    opacity: 0,
  },
  profilePicture: {
    alignSelf: 'center',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 52,
    width: 52,
    height: 52,
    resizeMode: 'cover',
    borderRadius: 26,
  },
}));

export default useStyles;
