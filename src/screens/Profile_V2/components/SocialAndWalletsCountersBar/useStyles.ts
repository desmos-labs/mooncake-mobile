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
    marginVertical: theme.spacing.s,
  },
  text: {
    marginLeft: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    borderWidth: 2,
    borderColor: theme.colors.white,
    borderRadius: 15,
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
}));

export default useStyles;
