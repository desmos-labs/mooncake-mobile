import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  tooltipGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  check: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: theme.spacing.xs,
  },
  tooltipValid: {
    color: theme.colors.accentGreen01,
  },
  tooltipText: {
    color: theme.colors.grey02,
  },
}));

export default useStyles;
