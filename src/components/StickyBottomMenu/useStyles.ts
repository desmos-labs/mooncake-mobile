import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  shadow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
}));

export default useStyles;
