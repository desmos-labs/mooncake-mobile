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

      width: 82,
      height: 32,

      /* Neutral Color/white */
      background: '#FFFFFF',
      borderRadius: 12,

      /* Inside auto layout */
      flexGrow: 0,
    },
    label: {
      /* Text */
      width: 53,
      height: 16,

      /* Button / Button 3 | Semibold 12 */
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 12,
      lineHeight: 16,
      /* identical to box height, or 133% */

      letterSpacing: 0.004,

      /* Primary color/Desmos Orange 01 */

      color: '#F3725A',

      /* Inside auto layout */
      flexGrow: 0,
    },
  };
});

export default useStyles;
