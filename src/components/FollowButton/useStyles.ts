import {makeStyle} from 'config/theme';

const useStyles = makeStyle(() => {
  return {
    svg: {
      position: 'absolute',
      zIndex: -1,
      width: '100%',
      height: '100%',
    },
    follow: {
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
    followLabel: {
      /* Neutral Color/White */
      color: '#FFFFFF',

      /* Inside auto layout */
      flexGrow: 0,
    },
    unfollow: {
      /* Auto layout */
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,

      width: 82,
      height: 32,

      /* Neutral Color/white */
      background: '#FFFFFF',
      borderRadius: 12,

      /* Inside auto layout */
      flexGrow: 0,
    },
    unfollowLabel: {
      /* Primary color/Desmos Orange 01 */
      color: '#F3725A',

      /* Inside auto layout */
      flexGrow: 0,
    },
  };
});

export default useStyles;
