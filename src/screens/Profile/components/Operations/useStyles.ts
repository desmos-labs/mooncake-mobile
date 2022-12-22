import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
}));

export default useStyles;
