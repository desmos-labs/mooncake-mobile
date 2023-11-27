import { Props } from 'components/DTextInput/index';
import { makeStyleWithProps } from 'config/theme';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    minHeight: 48,
    alignItems: 'center',
    // borderColor: props.error ? theme.colors.pink01 : theme.colors.lightGrey01,
    // borderWidth: 1,
  },
  input: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.025,
    textAlign: 'left',
    paddingHorizontal: 11,
    flexGrow: 1,
    flex: 0.95,
    // textAlignVertical: props.multiline === true ? 'top' : 'center',
    // height: '100%',
    color: props.error ? theme.colors.pink01 : theme.colors.surfaceBlack,
    minHeight: props.numberOfLines !== undefined ? 25 * props.numberOfLines : undefined,
  },
  right: {
    padding: 0,
    margin: 0,
    paddingRight: 8,
  },
}));

export default useStyles;
