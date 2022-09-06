import {makeStyle} from 'config/theme';
import {Platform} from 'react-native';

const useStyles = makeStyle(theme => ({
  connectButton: {
    height: 40,
    width: 300,
  },
  connectButtonText: {
    color: theme.colors.butterOrange01,
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
