import {makeStyle} from 'config/theme';

export type StyleProp = {
  numTypes: number;
};

/**
 * Style hook for the PostActionButtonsBar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    marginVertical: theme.spacing.m,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
  },
  text: {
    color: theme.colors.surfaceBlack,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 0.22,
  },
  icon: {
    marginRight: theme.spacing.xs,
    tintColor: theme.colors.surfaceBlack,
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  divider: {
    borderColor: 'rgba(239, 239, 239, 1)',
    borderWidth: 0.5,
  },
}));

export default useStyles;
