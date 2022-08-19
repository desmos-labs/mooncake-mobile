import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  icon: {
    marginRight: theme.spacing.l,
    height: 32,
    width: 32,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
  },
}));

export default useStyles;
