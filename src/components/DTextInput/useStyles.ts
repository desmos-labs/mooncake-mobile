import {Props} from 'components/DTextInput/index';
import {makeStyleWithProps} from 'config/theme';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: props.error ? theme.colors.pink03 : theme.colors.white,
    borderRadius: theme.roundness,
    minHeight: 44,
    alignItems: 'center',
    borderColor: props.error ? theme.colors.pink01 : theme.colors.background,
    borderWidth: 1,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 11,
    flexGrow: 1,
    flex: 0.9,
    textAlignVertical: props.multiline === true ? 'top' : 'center',
    height: '100%',
    color: theme.colors.black,
    minHeight:
      props.numberOfLines !== undefined ? 25 * props.numberOfLines : undefined,
  },
  right: {
    padding: 0,
    margin: 0,
    paddingRight: 11,
    flex: 0.1,
  },
}));

export default useStyles;
