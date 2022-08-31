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
      /* Primary color/Desmos Orange 01 */
      color: '#F3725A',

      /* Inside auto layout */
      flexGrow: 0,
    },
  };
});

export default useStyles;
