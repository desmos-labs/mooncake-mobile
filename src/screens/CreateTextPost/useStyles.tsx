import { makeStyle } from 'config/theme';
import { Dimensions, StyleSheet } from 'react-native';

/**
 * Style hook for the CreateTextPost screen
 */
const useStyles = makeStyle(theme => ({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeAreaContainer: {
    flex: 1,
  },
  postContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  textCounterContainer: {
    padding: theme.spacing.m,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  inputStyle: {
    padding: theme.spacing.m,
    color: theme.colors.white,
    // Typography.Body4
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    lineHeight: 27,
    letterSpacing: 0.0015,
    width: Dimensions.get('window').width,
    textAlign: 'center',
  },
  headerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  switchBgButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
}));

export default useStyles;
