import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    paddingVertical: theme.spacing.m,
    paddingBottom: 80,
    flexGrow: 1,
    backgroundColor: 'rgb(245,246,249)',
  },
  topBar: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },
  dView: {
    padding: theme.spacing.m,
    backgroundColor: 'transparent',
    maxHeight: '40%',
  },
  header: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  title: {
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
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
