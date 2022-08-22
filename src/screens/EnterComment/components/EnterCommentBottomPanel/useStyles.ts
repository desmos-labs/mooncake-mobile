import {makeStyle} from 'config/theme';

/**
 * Style hook for the EnterCommentBottom panel component
 */
const useStyles = makeStyle(theme => ({
  container: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.m,
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageButtonStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  leftGroup: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightGroup: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

export default useStyles;
