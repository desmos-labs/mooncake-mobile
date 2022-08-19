import {makeStyleWithProps} from 'config/theme';

export type StyleProp = {
  numTypes: number;
};

/**
 * Style hook for the InteractionSwitch component
 */
const useStyles = makeStyleWithProps((props: StyleProp, theme) => ({
  container: {
    flex: 1,
    marginVertical: theme.spacing.m,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
  },
  tabIndicator: {
    height: '100%',
    borderRadius: 14,
  },
  tabButton: {
    height: '100%',
    alignContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    minWidth: 120,
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
