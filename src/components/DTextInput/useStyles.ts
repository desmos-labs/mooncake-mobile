import {Props} from 'components/DTextInput/index';
import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    minHeight: 44,
    alignItems: 'center',
    borderColor: props.error ? theme.colors.error : theme.colors.surface,
    borderWidth: 2,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 11,
    flexGrow: 1,
    textAlignVertical: props.multiline === true ? 'top' : 'center',
    height: '100%',
    color: theme.colors.font['1'],
    minHeight:
      props.numberOfLines !== undefined ? 25 * props.numberOfLines : undefined,
  },
  right: {
    padding: 0,
    margin: 0,
    paddingRight: 11,
  },
}));

export default useStyles;
