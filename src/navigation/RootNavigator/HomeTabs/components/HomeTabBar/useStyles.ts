import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  container: {
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
  },
  tabContainer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  createPostButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'contain',
    backgroundColor: theme.colors.butterOrange01,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
}));

export default useStyles;
