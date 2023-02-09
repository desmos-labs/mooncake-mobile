import { expandCommentIcon } from 'assets/images';
import Button from 'components/Button';
import useDTextInputStyles from 'components/DTextInput/useStyles';
import ImageButton from 'components/ImageButton';
import MediaBottomPanel from 'components/MediaBottomPanel';
import SelectedCommentImage from 'components/SelectedCommentImage';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useImageFromDevice from 'hooks/useImageFromDevice';
import React, { useEffect, useMemo, useState } from 'react';
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
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import {
  useAddCreatePostAttachment,
  useCreatePostValue,
  useRemoveCreatePostAttachment,
  useSetCreatePostValue,
} from '@recoil/screens/createPostState';
import { DesmosProfile } from 'types/desmos';
import { getProfilePicture } from 'lib/ProfileUtils';
import usePostsParams from 'hooks/usePostsParams';
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
  const { t } = useTranslation('comment');
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();

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

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const RightButtonComponent = useMemo(() => {
    return (
      <Button
        mode="contained"
        disabled={attachment ? false : comment.length === 0}
        contentStyle={
          Platform.OS === 'android' && {
            height: '100%',
          }
        }
        style={styles.postButton}
        loading={loading}
        onPress={handlePostComment}>
        <Typography.Button3 style={{ color: theme.colors.white }}>{t('post')}</Typography.Button3>
      </Button>
    );
  }, [
    attachment,
    comment.length,
    styles.postButton,
    loading,
    handlePostComment,
    theme.colors.white,
    t,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? bottom + 40 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Shadow
        stretch={true}
        style={[styles.shadow, !keyboardShow ? { paddingBottom: bottom } : {}]}
        startColor="rgba(51, 51, 51, 0.1)"
        distance={30}>
        <View style={styles.container}>
          <FastImage source={getProfilePicture(author)} style={styles.profilePic} />
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
              />
            </ScrollView>
            <View
              pointerEvents={keyboardShow ? 'auto' : 'none'}
              style={styles.expandButtonContainer}>
              <ImageButton
                style={styles.expandButton}
                image={expandCommentIcon}
                onPress={onIconPress}
              />
            </View>
          </View>
        </View>
        {keyboardShow && (
          <MediaBottomPanel
            imageSelected={false}
            handlePressGallery={imageFromLibrary}
            handlePressCamera={imageFromCamera}
            handlePressMention={() => {
              console.log('placeholder');
            }}
            rightComponent={RightButtonComponent}
            commentLength={comment.length}
          />
        )}
      </Shadow>
    </KeyboardAvoidingView>
  );
};

export default EnterCommentBottomBar;
