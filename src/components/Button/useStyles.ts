import { makeStyle } from 'config/theme';

const useStyles = makeStyle(theme => {
  return {
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.roundness,
    },
    pressableView: {
      overflow: 'hidden',
      borderRadius: theme.roundness,
    },
    text: { backgroundColor: 'transparent' },
    contained: { backgroundColor: theme.colors.white },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.surfaceBlack,
      borderWidth: 1,
    },
    disabled: {
      backgroundColor: theme.colors.iconGrey,
      opacity: 0.5,
    },
    h56: {
      paddingVertical: 16,
    },
    h44: {
      paddingVertical: 12,
    },
    h32: {
      paddingVertical: 5,
    },
    h26: {
      paddingVertical: 2,
    },
  };
});

export default useStyles;
