import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
    borderRadius: 10,
    borderColor: theme.colors.primary,
  },
  mainTextColor: {
    color: theme.colors.neutralVariants['900'],
  },
}));

export default useStyles;
