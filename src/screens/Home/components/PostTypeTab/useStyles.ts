import {makeStyleWithProps} from 'config/theme';

export type StyleProp = {
  numTypes: number;
};

/**
 * Style hook for the InteractionSwitch component
 */
const useStyles = makeStyleWithProps((props: StyleProp, theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundGrey,
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
    // flex: 1,
    marginHorizontal: 8,
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
    top: theme.spacing.s,
    width: 4,
    height: 4,
    alignSelf: 'center',
    borderRadius: 4,
    backgroundColor: '#FF844F',
  },
}));

export default useStyles;
