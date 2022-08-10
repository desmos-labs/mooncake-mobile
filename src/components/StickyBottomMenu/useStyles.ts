import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 100,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
  },
  shadow: {
    flexDirection: 'row',
    zIndex: 100,
  },
}));

export default useStyles;
