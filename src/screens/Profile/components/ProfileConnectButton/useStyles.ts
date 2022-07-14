import {makeStyle} from 'config/theme';
import {Platform} from 'react-native';

const useStyles = makeStyle(theme => ({
  connectButton: {
    // width: scale(140),
    width: '100%',
    height: 40,
  },
  connectButtonText: {
    color: theme.colors.primary,
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
