import { useNavigation } from '@react-navigation/native';
import {
  useAddCreatePostAttachment,
  useCreatePostValue,
  useRemoveCreatePostAttachment,
  useResetCreatePostState,
  useSetCreatePostValue,
} from '@recoil/screens/createPostState';
import { expandCommentIcon } from 'assets/images';
import Button from 'components/Button';
import useDTextInputStyles from 'components/DTextInput/useStyles';
import CommentBottomBarLoadingOverlay from 'components/EnterCommentBottomBar/components/CommentBottomBarLoadingOverlay';
import ImageButton from 'components/ImageButton';
import MediaBottomPanel from 'components/MediaBottomPanel';
import SelectedCommentImage from 'components/SelectedCommentImage';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import { Image } from 'expo-image';
import usePostsParams from 'hooks/posts/usePostsParams';
import useImageFromDevice from 'hooks/useImageFromDevice';
import { getProfilePicture } from 'lib/ProfileUtils';
import { useTheme } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEventName,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { NavProps } from 'screens/Home';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

export type Props = {
  /**
   * User that is creating the comment.
   */
  author: DesmosProfile | undefined;

  /**
   * Action to execute when the right icon is pressed
   */
  onIconPress: () => void;

  /**
   * Callback to handle when the user submits a comment.
   */
  handlePostComment: () => void;

  /**
   * Is an action being processed? (block out interaction buttons)
   */
  loading?: boolean;

  /**
   * A reference to the comment input box.
   */
  textInputRef: any;
};

/**
 * Bottom bar that allows the user to enter a new comment to a post.
 * @constructor
 */
const EnterCommentBottomBar = (props: Props) => {
  const { t } = useTranslation('createPost');
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const navigation = useNavigation<NavProps['navigation']>();
  const { author, onIconPress, handlePostComment, textInputRef, loading } = props;

  // -------------------------------------------------------------------------------------
  // --- State
  // -------------------------------------------------------------------------------------

  const { params: postsParams } = usePostsParams();
  const comment = useCreatePostValue('text');
  const setComment = useSetCreatePostValue('text');

  const attachments = useCreatePostValue('attachments');
  const attachment = useMemo(
    () => (attachments !== undefined && attachments.length > 0 ? attachments[0] : undefined),
    [attachments],
  );
  const addAttachment = useAddCreatePostAttachment();
  const removeAttachment = useRemoveCreatePostAttachment();
  const resetCreatePostState = useResetCreatePostState();

  const [keyboardShow, setKeyboardShow] = useState<boolean>(false);

  const dTextInputStyles = useDTextInputStyles({});
  const styles = useStyles({
    baseTextInputStyle: dTextInputStyles.input,
    keyboardShow,
    bottomInset: bottom,
  });

  const { imageFromCamera, imageFromLibrary } = useImageFromDevice({
    onImageSelected: addAttachment,
  });

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.select({
        // keyboardWillShow only works on ios
        ios: 'keyboardWillShow',
        android: 'keyboardDidShow',
      }) as KeyboardEventName,
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.select({
        ios: 'keyboardWillHide',
        android: 'keyboardDidHide',
      }) as KeyboardEventName,
      () => {
        setKeyboardShow(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // When the user leaves the screen, we reset the state of the post and remove the attachment if any
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', () => {
        resetCreatePostState();
        if (attachment) {
          removeAttachment(attachment);
        }
      }),
    [attachment, navigation, removeAttachment, resetCreatePostState],
  );

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const onIconPressWrapper = useCallback(() => {
    requestAnimationFrame(() => {
      onIconPress();
    });
  }, [onIconPress]);

  const onPostCommentPressWrapper = useCallback(() => {
    requestAnimationFrame(() => {
      handlePostComment();
    });
  }, [handlePostComment]);

  const RightButtonComponent = useMemo(() => {
    if (loading) {
      return <StyledSpinner />;
    }
    return (
      <Button
        size={26}
        p={0}
        width={71}
        ml="12px"
        textColor={theme.colors.white}
        backgroundColor={theme.colors.butterOrange01}
        disabled={attachment ? false : comment.length === 0}
        onPress={onPostCommentPressWrapper}>
        {t('post')}
      </Button>
    );
  }, [
    loading,
    theme.colors.white,
    theme.colors.butterOrange01,
    attachment,
    comment.length,
    onPostCommentPressWrapper,
    t,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? (bottom ? bottom + 40 : 75) : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Shadow
        stretch={true}
        style={[styles.shadow, !keyboardShow ? { paddingBottom: bottom } : {}]}
        startColor="rgba(51, 51, 51, 0.1)"
        distance={30}>
        <View style={styles.container}>
          <Image source={getProfilePicture(author)} style={styles.profilePic} />
          <View style={styles.textInputContainer}>
            {/* TODO: Allow to have multiple attachments here */}
            {attachment && (
              <Spacer paddingBottom={12}>
                <SelectedCommentImage
                  handlePress={image => removeAttachment(image)}
                  source={{ uri: attachment.uri }}
                />
              </Spacer>
            )}
            <ScrollView
              keyboardShouldPersistTaps="always"
              overScrollMode="never"
              showsVerticalScrollIndicator
              contentContainerStyle={styles.textInputScrollContainer}>
              <TextInput
                multiline
                ref={textInputRef}
                maxLength={postsParams.maxTextLength}
                value={comment}
                onChangeText={text => setComment(text)}
                style={styles.textInput}
                placeholderTextColor={theme.colors.grey02}
                placeholder={t('write a comment')}
                textAlignVertical="center"
                contextMenuHidden={loading}
                caretHidden={loading}
                editable={!loading}
              />
            </ScrollView>
            <View
              pointerEvents={keyboardShow ? 'auto' : 'none'}
              style={styles.expandButtonContainer}>
              <ImageButton
                style={styles.expandButton}
                image={expandCommentIcon}
                onPress={onIconPressWrapper}
              />
            </View>
          </View>
        </View>
        {keyboardShow && (
          <MediaBottomPanel
            imageSelected={false}
            loading={loading}
            handlePressGallery={() => {
              if (loading) return;
              imageFromLibrary();
            }}
            handlePressCamera={() => {
              if (loading) return;
              imageFromCamera();
            }}
            rightComponent={RightButtonComponent}
            commentLength={comment.length}
          />
        )}
      </Shadow>
      {loading && <CommentBottomBarLoadingOverlay />}
    </KeyboardAvoidingView>
  );
};

export default EnterCommentBottomBar;
