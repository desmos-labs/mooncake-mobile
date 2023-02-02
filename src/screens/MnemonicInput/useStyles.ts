import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

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
    textAlignVertical: 'top',
    height: verticalScale(160),
  },
  mnemonicInputLabel: {
    alignSelf: 'stretch',
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
    paddingVertical: 8,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  consentText: {
    bottom: 4,
    lineHeight: 20,
    marginLeft: 8,
  },
  touchableText: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
