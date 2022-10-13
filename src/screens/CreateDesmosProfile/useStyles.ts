import {makeStyleWithProps} from 'config/theme';
import {RefObject} from 'react';
import {TextInput} from 'react-native';
import {verticalScale} from 'react-native-size-matters';

type Props = {
  nicknameInputRef: RefObject<TextInput>;
  dTagInputRef: RefObject<TextInput>;
  bioInputRef: RefObject<TextInput>;
};

const useStyles = makeStyleWithProps(
  ({nicknameInputRef, dTagInputRef, bioInputRef}: Props, theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.white,
    },
    headerButtonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      top: theme.spacing.l,
      paddingHorizontal: theme.spacing.m,
    },
    bannerImage: {
      width: '100%',
      height: verticalScale(230),
      resizeMode: 'cover',
      position: 'absolute',
      top: 0,
    },
    scrollView: {
      backgroundColor: theme.colors.white,
    },
    card: {
      paddingHorizontal: theme.spacing.m,
    },
    buttonGroup: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    inputLabel: {
      marginVertical: theme.spacing.s,
    },
    descriptionText: {
      marginBottom: theme.spacing.m,
    },
    cameraButton: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    inputStyle: {
      borderWidth: 1,
      borderColor: theme.colors.lightGrey01,
    },
    kbView: {
      flex: 1,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: theme.colors.white,
    },
    header: {paddingTop: 68, paddingHorizontal: theme.spacing.m},
    scrollContainer: {flex: 1},
    bioInput: {
      alignSelf: 'flex-start',
      height: '100%',
    },
    bioDTextInput: {
      minHeight: 120,
      borderWidth: 1,
      borderColor: theme.colors.lightGrey01,
    },
    errorText: {color: theme.colors.pink01, flex: 1},
    nickname: {opacity: nicknameInputRef.current?.isFocused() ? 1 : 0},
    dTag: {opacity: dTagInputRef.current?.isFocused() ? 1 : 0},
    bio: {opacity: bioInputRef.current?.isFocused() ? 1 : 0},
  }),
);

export default useStyles;
