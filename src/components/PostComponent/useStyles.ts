import {makeStyle} from 'config/theme';

/**
 * Theme hook for the PostCard component
 */
const useStyles = makeStyle(theme => ({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textContainer: {
    backgroundColor: theme.colors.desmosOrange01,
    height: 640,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: theme.colors.black,
    fontSize: 32,
  },
  imagePostText: {
    marginVertical: theme.spacing.m,
    color: theme.colors.black,
    marginHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
