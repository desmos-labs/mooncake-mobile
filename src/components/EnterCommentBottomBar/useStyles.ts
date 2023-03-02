import { makeStyleWithProps } from 'config/theme';
import { Dimensions, Platform } from 'react-native';

const useStyles = makeStyleWithProps(
  (
    props: {
      baseTextInputStyle: any;
      keyboardShow: boolean;
      bottomInset: number;
    },
    theme,
  ) => {
    return {
      postButton: {
        width: 71,
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
        marginBottom: props.bottomInset === 0 ? theme.spacing.s : 0,
      },
      textInputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: theme.colors.lightGrey01,
        borderRadius: 12,
        justifyContent: 'space-between',
        marginLeft: theme.spacing.s,
        padding: 12,
      },
      textInput: {
        ...props.baseTextInputStyle,
        flex: 1,
        color: theme.colors.surfaceBlack,
        paddingVertical: 0,
        paddingHorizontal: 0,
      },
      profilePic: {
        width: 38,
        height: 38,
        borderRadius: 38,
        alignSelf: 'flex-start',
      },
      expandButtonContainer: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        opacity: props.keyboardShow ? 1 : 0,
        alignSelf: 'flex-end',
      },
      expandButton: {
        width: 24,
        height: 24,
        bottom: Platform.select({
          ios: 0,
          android: 8,
        }),
      },
      textInputScrollContainer: {
        maxHeight: Dimensions.get('screen').height * 0.2,
        flexDirection: 'row',
        // spacing for expand button
        paddingRight: 24,
      },
    };
  },
);

export default useStyles;
