import {Props} from 'components/DView/index';
import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  root: {
    display: 'flex',
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
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor:
      props.background === undefined ? theme.colors.background : 'transparent',
  },
  scrollViewContainer: {
    flex: 1,
  },
}));

export default useStyles;
