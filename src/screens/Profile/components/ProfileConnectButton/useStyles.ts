import {makeStyle} from 'config/theme';
import {Platform} from 'react-native';

const useStyles = makeStyle(theme => ({
  connectButton: {
    flexGrow: 1,
    height: 40,
  },
  connectButtonText: {
    color: theme.colors.desmosOrange01,
    lineHeight: Platform.select({
      ios: 20,
      android: 23,
    }),
  },
  connectButtonContent: {
    height: '100%',
  },
}));

export default useStyles;
