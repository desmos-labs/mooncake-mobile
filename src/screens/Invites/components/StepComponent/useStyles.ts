import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  image: {
    height: 32,
    width: 32,
  },
  container: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'center',
  },
  disabledContainer: {
    marginVertical: theme.spacing.s,
    height: 16,
    width: 1.5,
    backgroundColor: theme.colors.butterOrange03,
  },
}));

export default useStyles;
