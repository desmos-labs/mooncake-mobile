import { makeStyleWithProps } from 'config/theme';
import { Props } from 'components/Button/components/MaterialButton/index';
import { StyleSheet } from 'react-native';

const useStyles = makeStyleWithProps((props: Props, theme) => {
  const accent = props.accent ? theme.colors.accent : theme.colors.butterOrange01;
  const color = props.color ? props.color : accent;
  return {
    labelStyle: {
      fontFamily: 'Poppins-SemiBold',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 16,
      lineHeight: 21,
      letterSpacing: 0.015,
      color:
        props.mode === 'contained' || props.mode === 'gradientFilled' ? theme.colors.white : color,
      textTransform: 'capitalize',
    },
    btnStyle: {
      borderColor: color,
      borderWidth: props.mode === 'outlined' ? 1 : 0,
    },
    contentStyle: {
      height: 52,
    },
    disabledStyle: {
      opacity: 0.5,
    },
    // gradient button
    container: {
      alignSelf: 'stretch',
      justifyContent: 'center',
    },
    maskedView: {
      ...StyleSheet.absoluteFillObject,
    },
    maskingContainer: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    masking: {
      alignSelf: 'stretch',
      padding: 24,
      borderRadius: theme.roundness,
      borderWidth: 1,
      borderColor: 'black',
    },
    linearGradient: {
      flex: 1,
    },
    buttonStyle: {
      alignSelf: 'stretch',
      zIndex: 2,
      borderRadius: theme.roundness,
    },
    gradientFilledContainer: {
      borderRadius: theme.roundness,
      overflow: 'hidden',
    },
    gradientFilledButton: {
      borderRadius: theme.roundness,
    },
    gradientFilledGradient: {
      paddingVertical: 14,
    },
    backgroundComponent: {
      position: 'absolute',
      zIndex: -1,
      width: '100%',
      height: '100%',
    },
    backgroundComponentButton: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});

export default useStyles;
