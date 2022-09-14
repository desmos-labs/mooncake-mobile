import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  section: {
    borderRadius: theme.roundness,
    flex: 1,
    backgroundColor: theme.colors.white,
  },
}));

export default useStyles;
