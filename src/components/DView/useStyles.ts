import {Props} from 'components/DView/index';
import {makeStyleWithProps} from 'config/theme';
import {StyleSheet} from 'react-native';

const useStyles = makeStyleWithProps((background: Props, theme) => ({
  root: {
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor:
      background === undefined ? theme.colors.background : 'transparent',
  },
  scrollViewOuter: {
    margin: -20,
  },
  scrollViewInner: {
    padding: 20,
    flexGrow: 1,
  },
}));

export default useStyles;
