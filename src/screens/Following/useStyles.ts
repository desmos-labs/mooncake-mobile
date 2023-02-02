import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
}));

export default useStyles;
