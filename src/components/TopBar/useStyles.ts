import {makeStyle} from 'config/theme';
import {Platform, StatusBar} from 'react-native';

const useStyles = makeStyle(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 42,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  containerCenter: {
    flex: 2,
  },
  containerRight: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
}));

export default useStyles;
