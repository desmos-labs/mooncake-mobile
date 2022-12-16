import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
