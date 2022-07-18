import {makeStyle} from 'config/theme';
import {verticalScale} from 'react-native-size-matters';

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
    height: verticalScale(160),
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
    color: theme.colors.desmosOrange01,
  },
}));

export default useStyles;
