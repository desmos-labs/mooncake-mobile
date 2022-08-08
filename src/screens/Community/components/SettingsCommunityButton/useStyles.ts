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
    borderRadius: 12,
    backgroundColor: theme.colors.background,
  },
  button: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  textContainer: {
    marginHorizontal: 12,
  },
  arrowIcon: {
    marginRight: theme.spacing.s,
    marginLeft: 'auto',
    alignSelf: 'center',
  },
  image: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
    borderRadius: 26,
    alignSelf: 'center',
  },
}));

export default useStyles;
