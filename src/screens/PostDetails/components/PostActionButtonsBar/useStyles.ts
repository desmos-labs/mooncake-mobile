import { makeStyle } from 'config/theme';

/**
 * Style hook for the PostActionButtonsBar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    marginVertical: theme.spacings.m,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    justifyContent: 'space-around',
  },
  text: {
    color: theme.colors.neutralVariants['700'],
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 0.22,
  },
  icon: {
    marginRight: theme.spacings.xs,
    tintColor: theme.colors.neutralVariants['700'],
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  divider: {
    borderColor: 'rgba(239, 239, 239, 1)',
    borderWidth: 0.5,
  },
  orangeIconAndText: {
    tintColor: theme.colors.primary,
  },
  orangeText: { color: theme.colors.primary },
}));

export default useStyles;
