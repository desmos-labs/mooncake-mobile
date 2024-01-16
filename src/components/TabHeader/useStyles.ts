import { makeStyle } from 'config/theme';

/**
 * Style hook for the PostActionButtonsBar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  tabIndicator: {
    height: '100%',
    position: 'absolute',
    left: '0%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  tabButton: {
    height: '100%',
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
  },
  unselected: {
    color: theme.colors.surfaceBlack,
    opacity: 0.5,
  },
  selected: {
    color: theme.colors.surfaceBlack,
  },
  gradient: {
    flex: 1,
  },
  selectedIndicator: {
    top: theme.spacing.xs,
    width: 24,
    height: 2,
    alignSelf: 'center',
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceBlack,
  },
}));

export default useStyles;
