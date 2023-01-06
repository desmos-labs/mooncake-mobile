import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  butterflyImage: {
    width: 40,
    height: 40,
    borderRadius: 18,
    resizeMode: 'cover',
  },
  container: {
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.white,
  },
  tabContainer: {
    marginTop: theme.spacing.xs,
    justifyContent: 'center',
  },
  rightButton: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xs,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
}));

export default useStyles;
