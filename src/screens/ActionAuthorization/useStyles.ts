import { makeStyle } from 'config/theme';
import { StyleSheet } from 'react-native';

/**
 * Style hook for the Authorization screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  innerContainer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.white,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  bar: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    backgroundColor: '#DEDEDE',
  },
  centered: {
    textAlign: 'center',
  },
  textStyle: {
    color: theme.colors.surfaceBlack,
  },
  imageStyle: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginVertical: theme.spacing.m,
    alignSelf: 'center',
  },
  dismissTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.m,
  },
  innerModalContainer: {
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
  },
  bodyText: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  primaryButton: {
    alignSelf: 'stretch',
    marginBottom: theme.spacing.l,
    backgroundColor: theme.colors.surfaceBlack,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    marginBottom: theme.spacing.s,
  },
}));

export default useStyles;
