import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
