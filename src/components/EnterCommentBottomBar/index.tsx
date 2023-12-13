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
import ImageButton from 'components/ImageButton';
import MediaBottomPanel from 'components/MediaBottomPanel';
import SelectedCommentImage from 'components/SelectedCommentImage';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import { Image } from 'expo-image';
import { CameraType } from 'expo-image-picker';
import useTakePicture, { TakePictureActionResults } from 'hooks/camera/useTakePicture';
import usePostsParams from 'hooks/posts/usePostsParams';
import useImageFromDevice from 'hooks/useImageFromDevice';
import useOpenPictureEditor from 'hooks/useOpenPictureEditor';
import { getProfilePicture } from 'lib/ProfileUtils';
import { useTheme } from 'native-base';
import React, { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
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
  const comment = useCreatePostValue('text');
  const setComment = useSetCreatePostValue('text');
  const postAttachments = useCreatePostValue('attachments');
  const addPostAttachment = useAddCreatePostAttachment();
  const { editPostPicture } = useOpenPictureEditor();
  const takePhoto = useTakePicture();

  const { imageFromLibrary: selectPicture } = useImageFromDevice({
    onImageSelected: imageUri => {
      editPostPicture(imageUri, (editedPicturePath, dimensions, mimeType) => {
        addPostAttachment({
          uri: editedPicturePath,
          width: dimensions.width,
          height: dimensions.height,
          type: mimeType,
        });
      });
    },
  });

  const handleTakePicture = useCallback(async () => {
    takePhoto(CameraType.front).then(result => {
      if (result?.status === TakePictureActionResults.Taken) {
        const imageUri = result.uri;
        editPostPicture(imageUri, (editedPicturePath, dimensions, mimeType) => {
          addPostAttachment({
            uri: editedPicturePath,
            width: dimensions.width,
            height: dimensions.height,
            type: mimeType,
          });
        });
      }
    });
  }, [addPostAttachment, editPostPicture, takePhoto]);

  const [keyboardShow, setKeyboardShow] = useState<boolean>(false);

  const dTextInputStyles = useDTextInputStyles({});
  const styles = useStyles({
    baseTextInputStyle: dTextInputStyles.input,
    keyboardShow,
    bottomInset: bottom,
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
      <Button
        size={30}
        p={0}
        width={71}
        ml="12px"
        textColor={theme.colors.white}
        backgroundColor={theme.colors.butterOrange01}
        disabled={postAttachments.length === 0 && comment.length === 0}
        onPress={onPostCommentPressWrapper}>
        {t('post')}
      </Button>
    );
  }, [loading, theme, postAttachments.length, comment.length, onPostCommentPressWrapper, t]);

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Shadow
        stretch={true}
        style={[styles.shadow, !keyboardShow ? { paddingBottom: bottom } : {}]}
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
            handlePressGallery={selectPicture}
            handlePressCamera={handleTakePicture}
            rightComponent={RightButtonComponent}
            commentLength={comment.length}
          />
        )}
      </Shadow>
    </KeyboardAvoidingView>
  );
};

export default EnterCommentBottomBar;
