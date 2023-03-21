import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  loadingView: { flex: 1, flexGrow: 1, backgroundColor: theme.colors.white },
}));

export default useStyles;
