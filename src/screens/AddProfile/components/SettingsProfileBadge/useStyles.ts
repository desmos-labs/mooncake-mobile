import {makeStyle} from 'config/theme';

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
}));

export default useStyles;
