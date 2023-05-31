import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.lightGrey01,
    borderRadius: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: theme.colors.lightGrey01,
  },
  arrowRight: {
    width: 16.5,
    height: 9,
    resizeMode: 'contain',
  },
}));

export default useStyles;
