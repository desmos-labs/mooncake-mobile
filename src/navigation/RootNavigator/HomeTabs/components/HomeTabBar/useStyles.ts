import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  butterflyImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
    marginRight: theme.spacing.xs,
  },
  container: {
    marginTop: theme.spacing.xs,
    paddingBottom: theme.spacing.s,
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
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
}));

export default useStyles;
