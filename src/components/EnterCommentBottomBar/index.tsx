import { useNavigation, useTheme } from '@react-navigation/native';
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
import ImageButton from 'components/ImageButton';
import MediaBottomPanel, { OnImageSelectedCallback } from 'components/MediaBottomPanel';
import SelectedCommentImage from 'components/SelectedCommentImage';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import { Image } from 'expo-image';
import usePostsParams from 'hooks/posts/usePostsParams';
import useKeyboardVisibility from 'hooks/useKeyboardVisibility';
import { getProfilePicture } from 'lib/ProfileUtils';
import React, { RefObject, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { NavProps } from 'screens/Home';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

type Props = {
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
  textInputRef: RefObject<TextInput>;
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
  // --- Hooks
  // -------------------------------------------------------------------------------------
  const removeAttachment = useRemoveCreatePostAttachment();
  const resetCreatePostState = useResetCreatePostState();

  // -------------------------------------------------------------------------------------
  // --- State
  // -------------------------------------------------------------------------------------
  const [textInputNumberOfLines, setTextInputNumberOfLines] = useState(0);
  const { params: postsParams } = usePostsParams();
  const { keyboardVisible } = useKeyboardVisibility();
  const comment = useCreatePostValue('text');
  const setComment = useSetCreatePostValue('text');
  const postAttachments = useCreatePostValue('attachments');
  const addPostAttachment = useAddCreatePostAttachment();

  const onPictureTaken = useCallback<OnImageSelectedCallback>(
    (editedPicturePath, dimensions, mimeType) => {
      addPostAttachment({
        uri: editedPicturePath,
        width: dimensions.width,
        height: dimensions.height,
        type: mimeType,
      });
    },
    [addPostAttachment],
  );

  const dTextInputStyles = useDTextInputStyles({});
  const styles = useStyles({
    baseTextInputStyle: dTextInputStyles.input,
    keyboardShow: keyboardVisible,
    bottomInset: bottom,
  });

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // When the user leaves the screen, we reset the state of the post and remove the attachment if any
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', () => {
        resetCreatePostState();
        removeAttachment(postAttachments[0]);
      }),
    [navigation, postAttachments, removeAttachment, resetCreatePostState],
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
      <>
        <Spacer paddingLeft="s" />
        <Button
          height={32}
          disabled={postAttachments.length === 0 && comment.length === 0}
          onPress={onPostCommentPressWrapper}>
          {t('post')}
        </Button>
      </>
    );
  }, [loading, postAttachments.length, comment.length, onPostCommentPressWrapper, t]);

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Shadow
        stretch={true}
        style={[styles.shadow, !keyboardVisible ? { paddingBottom: bottom } : {}]}
        startColor="rgba(51, 51, 51, 0.1)"
        distance={30}>
        <View style={styles.container}>
          <Image
            source={getProfilePicture(author)}
            style={[
              styles.profilePic,
              textInputNumberOfLines >= 2 ? { alignSelf: 'flex-start' } : { alignSelf: 'center' },
            ]}
          />
          <View style={styles.textInputContainer}>
            {/* TODO: Allow to have multiple attachments here */}
            {postAttachments[0] && (
              <Spacer paddingBottom={12}>
                <SelectedCommentImage
                  handlePress={image => removeAttachment(image)}
                  source={{ uri: postAttachments[0].uri }}
                />
              </Spacer>
            )}
            <ScrollView
              keyboardShouldPersistTaps="always"
              overScrollMode="never"
              showsVerticalScrollIndicator
              contentContainerStyle={styles.textInputScrollContainer}>
              <TextInput
                onContentSizeChange={e => {
                  setTextInputNumberOfLines(Math.round(e.nativeEvent.contentSize.height / 21));
                }}
                multiline
                ref={textInputRef}
                maxLength={postsParams.maxTextLength}
                value={comment}
                onChangeText={text => setComment(text)}
                style={styles.textInput}
                placeholderTextColor={theme.colors.neutralVariants['600']}
                placeholder={t('write a comment')}
                textAlignVertical="center"
                contextMenuHidden={loading}
                caretHidden={loading}
                editable={!loading}
                blurOnSubmit={true}
              />
            </ScrollView>
            <View
              pointerEvents={keyboardVisible ? 'auto' : 'none'}
              style={styles.expandButtonContainer}>
              <ImageButton
                style={styles.expandButton}
                image={expandCommentIcon}
                onPress={onIconPressWrapper}
              />
            </View>
          </View>
        </View>
        {keyboardVisible && (
          <MediaBottomPanel
            imageSelected={false}
            loading={loading}
            onImageSelected={onPictureTaken}
            rightComponent={RightButtonComponent}
            textLength={comment.length}
            allowPictures={false}
          />
        )}
      </Shadow>
    </KeyboardAvoidingView>
  );
};

export default EnterCommentBottomBar;
