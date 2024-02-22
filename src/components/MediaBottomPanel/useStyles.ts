import { makeStyle } from 'config/theme';

/**
 * Style hook for the EnterCommentBottom panel component
 */
const useStyles = makeStyle(theme => ({
  container: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacings.m,
    alignItems: 'center',
    flexDirection: 'row',
  },
  imageButtonStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  leftGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacings.l,
  },
  rightGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));

export default useStyles;
