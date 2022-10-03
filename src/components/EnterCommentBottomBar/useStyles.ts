import {makeStyle} from 'config/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Dimensions, Platform} from 'react-native';

const useStyles = makeStyle(theme => {
  const {bottom} = useSafeAreaInsets();

  return {
    postButton: {
      height: 30,
      width: 70,
      justifyContent: 'center',
      marginLeft: 12,
    },
    shadow: {
      backgroundColor: theme.colors.white,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    container: {
      flexDirection: 'row',
      width: '100%',
      // Add spacing for devices that do not require bottom safe-area
      marginBottom: bottom === 0 ? theme.spacing.s : 0,
      maxHeight: Dimensions.get('screen').height * 0.2,
    },
    textInputContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.lightGrey01,
      borderRadius: 12,
      justifyContent: 'space-between',
      paddingVertical: Platform.select({
        ios: 8,
        android: 0,
      }),
      marginLeft: theme.spacing.s,
      paddingHorizontal: theme.spacing.s,
    },
    textInput: {
      flex: 1,
      color: theme.colors.surfaceBlack,
    },
    profilePic: {
      width: 38,
      height: 38,
      borderRadius: 38,
      alignSelf: 'center',
    },
  };
});

export default useStyles;
