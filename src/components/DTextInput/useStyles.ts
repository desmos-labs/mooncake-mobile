import { Props } from 'components/DTextInput/index';
import { makeStyleWithProps } from 'config/theme';

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderWidth: props.showBorder ? 1 : 0,
    borderColor: props.error ? theme.colors.pink01 : undefined,
    borderRadius: 8,
    minHeight: 48,
    alignItems: 'center',
  },
  input: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    textAlign: 'left',
    paddingHorizontal: 11,
    flexGrow: 1,
    flex: 0.95,
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
