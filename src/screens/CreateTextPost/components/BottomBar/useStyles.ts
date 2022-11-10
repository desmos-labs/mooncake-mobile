import {makeStyle} from 'config/theme';

/**
 * Style hook for the BottomBar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#000000',
    zIndex: 2,
  },
  postButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
  },
  leftButtonGroup: {
    flexDirection: 'row',
  },
  cameraButton: {
    marginLeft: theme.spacing.m,
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
}));

export default useStyles;
