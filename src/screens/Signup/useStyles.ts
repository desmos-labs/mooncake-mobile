/**
 * Style hook for the ChangePassword screen
 */
import {makeStyle} from 'config/theme';

const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    padding: theme.spacing.m,
    paddingTop: 0, // override top padding
    backgroundColor: theme.colors.white,
  },
  headerText: {
    marginBottom: theme.spacing.m,
  },
  formContainer: {
    flex: 1,
  },
  inputLabel: {
    borderColor: theme.colors.lightGrey01,
    borderWidth: 1,
    marginBottom: theme.spacing.s,
  },
  buttonGroup: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  confirmButtonText: {
    color: theme.colors.white,
    lineHeight: 30,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    color: theme.colors.pink01,
  },
  errorTextDtag: {
    marginBottom: theme.spacing.m,
    color: theme.colors.pink01,
  },
  labelGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  weakPw: {
    color: theme.colors.accentOrange01,
  },
  mediumPw: {
    color: theme.colors.accentYellow01,
  },
  strongPw: {
    color: theme.colors.accentGreen01,
  },
  dTagRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consentGroup: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
    marginTop: theme.spacing.m,
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
  touchableTextChecked: {
    color: theme.colors.accentGreen01,
  },
  iconButton: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    margin: theme.spacing.s,
  },
  completeProfileButton: {
    alignSelf: 'flex-end',
    color: theme.colors.butterOrange01,
  },
}));

export default useStyles;
