import {makeStyle} from 'config/theme';

export type StyleProp = {
  numTypes: number;
};

/**
 * Style hook for the PostActionButtonsBar component
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: theme.spacing.xs,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  icon1: {
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: 15,
    position: 'absolute',
    width: 28,
    height: 28,
    resizeMode: 'cover',
  },
  icon2: {
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: 15,
    position: 'absolute',
    width: 28,
    height: 28,
    transform: [{translateX: 21}],
    resizeMode: 'cover',
  },
  icon3: {
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: 15,
    position: 'absolute',
    width: 28,
    height: 28,
    transform: [{translateX: 42}],
    resizeMode: 'cover',
  },
}));

export default useStyles;
