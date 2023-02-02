import { makeStyle } from 'config/theme';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  externalContainer: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 19,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  textContainer: {
    marginHorizontal: 12,
  },
  radioButton: {
    marginRight: 0,
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  profilePicture: {
    width: 52,
    height: 52,
    resizeMode: 'cover',
    borderRadius: 26,
    alignSelf: 'center',
  },
  firstBox: {
    right: 90,
    borderRadius: 12,
    width: 78,
    paddingVertical: 20,
    position: 'absolute',
    backgroundColor: 'rgba(0, 127, 255, 0.05)',
  },

  secondBox: {
    right: 0,
    borderRadius: 12,
    paddingVertical: 20,
    width: 78,
    position: 'absolute',
    backgroundColor: theme.colors.pink03,
  },
}));

export default useStyles;
