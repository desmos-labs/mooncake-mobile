import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => {
  return {
    svg: {
      position: 'absolute',
      zIndex: -1,
      width: '100%',
      height: '100%',
    },
    follow: {
      /* Auto layout */
      justifyContent: 'center',
      padding: 0,
      width: 83,
      height: 32,

      borderRadius: 12,
      /* Primary Orange* /Butter Orange 01 */
      backgroundColor: theme.colors.butterOrange01,
    },
    followLabel: {
      margin: 0,
      pading: 0,
      minWidth: '100%',
      textAlign: 'center',
      /* Neutral Color/white */
      color: theme.colors.white,
    },
    unfollow: {
      /* Auto layout */
      justifyContent: 'center',
      padding: 0,
      width: 82,
      height: 32,

      /* Neutral Color/white */
      backgroundColor: theme.colors.white,
      borderRadius: 12,
      /* Neutral Color/Surface Black */
      borderColor: theme.colors.surfaceBlack,
    },
    unfollowLabel: {
      margin: 0,
      padding: 0,
      minWidth: '100%',
      textAlign: 'center',
      /* Neutral Color/Surface Black */
      color: theme.colors.surfaceBlack,
    },
  };
});

export default useStyles;
