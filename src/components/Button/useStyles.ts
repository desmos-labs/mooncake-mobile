import {makeStyle} from 'config/theme';

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
    text: {backgroundColor: 'transparent'},
    contained: {backgroundColor: theme.colors.white},
    outlined: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.surfaceBlack,
      borderWidth: 1,
    },
    disabledStyle: {
      opacity: 0.5,
    },
    h56: {
      paddingVertical: theme.spacing.l,
    },
    h44: {
      paddingVertical: theme.spacing.m,
    },
    h32: {
      paddingVertical: theme.spacing.s,
    },
    h26: {
      paddingVertical: theme.spacing.xs,
    },
  };
});

export default useStyles;
