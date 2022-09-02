import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => {
  return {
    svg: {
      position: 'absolute',
      zIndex: -1,
      width: '100%',
      height: '100%',
    },
    button: {
      /* Auto layout */
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      width: 83,
      height: 32,

      /* Primary color/Desmos Orange Gradient 02 */
      borderRadius: 12,
      background: '#FF844F',

      /* Inside auto layout */
      flexGrow: 0,
    },
    label: {
      /* Neutral Color/White */
      color: '#FFFFFF',

      /* Inside auto layout */
      flexGrow: 0,
    },
  };
});

export default useStyles;
