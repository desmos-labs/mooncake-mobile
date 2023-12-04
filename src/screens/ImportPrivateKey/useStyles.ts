/**
 * Style hook for the ChangePassword screen
 */
import { makeStyle } from 'config/theme';
import { verticalScale } from 'react-native-size-matters';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  headerText: {
    marginVertical: theme.spacing.m,
  },
  formContainer: {
    flex: 1,
  },
  bottomLabel: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  inputLabel: {
    borderRadius: 12,
  },
  confirmButtonText: {
    color: theme.colors.white,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.error,
  },
  labelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.s,
  },
  marginXs: { marginTop: theme.spacing.xs },
  confirmButton: {
    marginBottom: theme.spacing.s,
  },
  messageView: { justifyContent: 'flex-end', alignItems: 'center', height: 300 },
  mnemonicInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightGrey01,
    paddingTop: theme.spacing.s,
    textAlignVertical: 'top',
    height: verticalScale(160),
  },
  mnemonicInputLabel: {
    alignSelf: 'stretch',
  },
}));

export default useStyles;
