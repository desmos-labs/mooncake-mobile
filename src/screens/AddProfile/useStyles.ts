import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
    flexGrow: 1,
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
