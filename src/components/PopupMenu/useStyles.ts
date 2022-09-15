import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    backgroundColor: theme.colors.white,
  },
  icon: {
    marginRight: theme.spacing.s,
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing.m,
    marginRight: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  divider: {
    borderColor: theme.colors.lightGrey01,
    borderWidth: 0.5,
  },
}));

export default useStyles;
