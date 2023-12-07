import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 5,
  },
  container: {
    alignItems: 'center',
  },
  containerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 0.25,
  },
  containerCenter: {
    alignItems: 'center',
    flex: 0.5,
    justifyContent: 'center',
  },
  containerRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 0.25,
  },
}));

export default useStyles;
