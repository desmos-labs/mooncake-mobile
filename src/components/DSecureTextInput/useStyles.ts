import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  focused: {
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.desmosOrange1,
  },
}));

export default useStyles;
