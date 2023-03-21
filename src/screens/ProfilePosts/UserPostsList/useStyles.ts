import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
  contentContainerStyle: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
}));

export default useStyles;
