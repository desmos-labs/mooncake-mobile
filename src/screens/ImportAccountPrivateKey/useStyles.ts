/**
 * Style hook for the ChangePassword screen
 */
import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacings.m,
  },
  headerText: {
    marginVertical: theme.spacings.m,
  },
  formContainer: {
    flex: 1,
  },
  bottomLabel: {
    marginTop: theme.spacings.m,
    marginBottom: theme.spacings.s,
  },
  inputLabel: {
    borderRadius: 12,
  },
  confirmButtonText: {
    color: theme.colors.white,
  },
  errorText: {
    marginTop: theme.spacings.xs,
    color: theme.colors.error,
  },
  labelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacings.s,
  },
  marginXs: { marginTop: theme.spacings.xs },
  confirmButton: {
    marginBottom: theme.spacings.s,
  },
  messageView: { justifyContent: 'flex-end', alignItems: 'center', height: 300 },
  mnemonicInput: {
    borderWidth: 1,
    borderColor: theme.colors.neutralVariants['600'],
    paddingTop: theme.spacings.s,
    textAlignVertical: 'top',
    height: verticalScale(160),
  },
  mnemonicInputLabel: {
    alignSelf: 'stretch',
  },
}));

export default useStyles;
