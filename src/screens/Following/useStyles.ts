import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
  flatList: {
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
