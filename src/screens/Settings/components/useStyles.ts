import {makeStyle} from 'config/theme';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  externalShadow: {
    borderRadius: 12,
    width: '100%',
    backgroundColor: theme.colors.background,
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 19,
    borderRadius: 12,
    width: '100%',
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
