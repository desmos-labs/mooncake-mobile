import { makeStyleWithProps } from 'config/theme';
import { Dimensions } from 'react-native';

const useStyles = makeStyleWithProps((numOfTabs: number, theme) => ({
  container: {
    backgroundColor: theme.colors.white,
    flexGrow: 1,
  },
  topBar: {
    backgroundColor: theme.colors.white,
    shadowOpacity: 0,
    marginHorizontal: theme.spacing.m,
  },
  tabBar: {
    borderBottomWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.white,
  },
  tabBarContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainerStyle: {
    backgroundColor: 'transparent',
  },
  tabBarLabel: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 21,
    textAlign: 'left',
    textTransform: 'none',
  },

  tabBarIndicator: {
    backgroundColor: theme.colors.surfaceBlack,
    width: 28,
    height: 2,
    borderRadius: 4,
    left: (Dimensions.get('window').width / 2 - 28) / 2,
  },
}));

export default useStyles;
