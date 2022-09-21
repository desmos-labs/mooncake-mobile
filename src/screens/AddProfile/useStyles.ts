import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    paddingVertical: theme.spacing.m,
    paddingBottom: 80,
    flexGrow: 1,
  },
  header: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  title: {
    paddingHorizontal: theme.spacing.m,
  },
  headerBackImage: {
    marginHorizontal: 8,
    padding: 12,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
}));

export default useStyles;
