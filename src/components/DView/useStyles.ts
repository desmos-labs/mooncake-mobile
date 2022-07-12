import {Props} from 'components/DView/index';
import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  root: {
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor:
      props.background === undefined ? theme.colors.background : 'transparent',
  },
  scrollViewOuter: {
    margin: -20,
  },
  scrollViewInner: {
    padding: 20,
  },
}));

export default useStyles;
