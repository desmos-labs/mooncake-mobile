import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

/**
 * Style hook for the MnemonicInput screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    padding: theme.spacing.m,
  },
  descriptionText: {
    marginVertical: theme.spacing.m,
  },
  inputLabel: {
    marginBottom: theme.spacing.s,
  },
  mnemonicInput: {
    borderWidth: 1,
    borderColor: 'transparent',
    paddingTop: theme.spacing.s,
    paddingBottom: verticalScale(160),
  },
  errorInput: {
    borderColor: theme.colors.pink01,
  },
  errorGroup: {
    marginTop: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorColor: {
    color: theme.colors.pink01,
  },
  errorText: {
    color: theme.colors.pink01,
    flex: 1,
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  formContainer: {
    flex: 1,
  },
  labelStyle: {
    color: theme.colors.white,
  },
  clearAllText: {
    color: theme.colors.butterOrange01,
  },
  consentGroup: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  consentText: {
    bottom: 4,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  touchableText: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
