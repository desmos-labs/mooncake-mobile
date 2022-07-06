import {makeStyleWithProps} from 'config/theme';

export type StyleProp = {
  numTypes: number;
};

/**
 * Style hook for the PostTypeTab component
 */
const useStyles = makeStyleWithProps((props: StyleProp, theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundGray,
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
    flex: 1,
    marginHorizontal: 8,
    height: '100%',
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
  },
  unselected: {
    color: theme.colors.primary,
  },
  selected: {
    color: theme.colors.font[5],
  },
  gradient: {
    flex: 1,
  },
}));

export default useStyles;
