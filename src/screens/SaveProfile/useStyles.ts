import { makeStyleWithProps } from 'config/theme';
import { RefObject } from 'react';
import { Dimensions, TextInput } from 'react-native';
import { PROFILE_HEADER_HEIGHT } from 'screens/Profile/useStyles';

type Props = {
  nicknameInputRef: RefObject<TextInput>;
  dTagInputRef: RefObject<TextInput>;
  bioInputRef: RefObject<TextInput>;
};

const useStyles = makeStyleWithProps(
  ({ nicknameInputRef, dTagInputRef, bioInputRef }: Props, theme) => ({
    container: {
      flex: 1,
    },
    headerText: {
      marginTop: 60,
      textAlign: 'center',
      alignItems: 'center',
      paddingBottom: theme.spacings.xs,
    },
    headerButtonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacings.m,
      zIndex: 2,
    },
    coverPicBackground: {
      height: PROFILE_HEADER_HEIGHT,
      position: 'absolute',
      width: Dimensions.get('window').width,
      zIndex: 1,
    },
    icon: { width: 24, height: 24 },

    scrollView: {
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
    },
    card: {
      paddingHorizontal: theme.spacings.m,
    },
    buttonGroup: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    inputLabel: {
      marginVertical: theme.spacings.s,
    },
    dtagView: {
      marginVertical: theme.spacings.s,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    descriptionText: {
      marginBottom: theme.spacings.m,
    },
    topButton: {
      width: 32,
      height: 32,
      resizeMode: 'contain',
    },
    kbView: {
      flex: 1,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: theme.colors.white,
      zIndex: 2,
      marginTop: 60,
    },
    scrollContainer: {
      flex: 1,
      marginTop: theme.spacings.xs,
    },
    bioInput: {
      height: 180,
      alignSelf: 'flex-start',
      textAlignVertical: 'top',
      paddingTop: 8,
    },
    bioDTextInput: {
      borderWidth: 1,
      borderColor: theme.colors.neutralVariants['600'],
    },
    errorText: {
      color: theme.colors.feedback.error,
      flex: 1,
    },
    nickname: {
      opacity: nicknameInputRef.current?.isFocused() ? 1 : 0,
    },
    dTag: {
      opacity: dTagInputRef.current?.isFocused() ? 1 : 0,
    },
    bio: {
      opacity: bioInputRef.current?.isFocused() ? 1 : 0,
    },
  }),
);

export default useStyles;
