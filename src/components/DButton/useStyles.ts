import {makeStyleWithProps} from 'config/theme';
import {Props} from 'components/DButton/index';

const useStyles = makeStyleWithProps((props: Props, theme) => {
  const accent = props.accent ? theme.colors.accent : theme.colors.primary;
  const color = props.color ? props.color : accent;
  return {
    labelStyle: {
      fontFamily: 'Poppins-SemiBold',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.015,
      color: props.mode === 'contained' ? theme.colors.font['5'] : color,
      textTransform: 'capitalize',
    },
    btnStyle: {
      borderColor: color,
      borderWidth: props.mode === 'outlined' ? 1 : 0,
    },
    contentStyle: {
      height: 52,
    },
  };
});

export default useStyles;
