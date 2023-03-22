import { makeStyle } from 'config/theme';
import { scale } from 'react-native-size-matters';

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
  loadingContainer: {
    alignSelf: 'flex-start',
    left: 26,
    height: scale(18),
  },
}));

export default useStyles;
