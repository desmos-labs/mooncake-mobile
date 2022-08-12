import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 40,
    justifyContent: 'space-around',
  },
  shadow: {
    flexDirection: 'row',
    bottom: 0,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-around',
  },
}));

export default useStyles;
