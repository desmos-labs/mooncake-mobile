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
      gap: 10,
      width: 83,
      height: 32,

      /* Primary color/Desmos Orange Gradient 02 */
      borderRadius: 12,
      background: '#FF844F',

      /* Inside auto layout */
      flexGrow: 0,
    },
    label: {
      /* Text */
      width: 39,
      height: 16,

      /* Button / Button 3 | Semibold 12 */
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 12,
      lineHeight: 16,
      /* identical to box height, or 133% */

      letterSpacing: 0.004,

      /* Neutral Color/White */

      color: '#FFFFFF',

      /* Inside auto layout */
      flexGrow: 0,
    },
  };
});

export default useStyles;
