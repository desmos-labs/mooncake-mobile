import {postAttachmentsState, postTextState} from '@recoil/sharedPostState';
import {expandCommentIcon} from 'assets/images';
import Button from 'components/Button';
import useDTextInputStyles from 'components/DTextInput/useStyles';
import ImageButton from 'components/ImageButton';
import MediaBottomPanel from 'components/MediaBottomPanel';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import SelectedCommentImage from 'components/SelectedCommentImage';
import Spacer from 'components/Spacer';
import EnvConfig from 'config/EnvConfig';
import useImageFromDevice from 'hooks/useImageFromDevice';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEventName,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import {useRecoilState, useResetRecoilState} from 'recoil';
import useStyles from './useStyles';

export type Props = {
  /**
   * Source of the image to display
   */
  profileImage: React.ComponentProps<typeof ProfileHeaderButton>['imageSrc'];

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

const EnterCommentBottomBar: React.FC<Props> = ({
  profileImage,
  onIconPress,
  handlePostComment,
  textInputRef,
  loading,
}) => {
  const {t} = useTranslation('comment');
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const [comment, setComment] = useRecoilState(postTextState);
  const [commentAttachment, setCommentAttachment] =
    useRecoilState(postAttachmentsState);
  const resetCommentAttachment = useResetRecoilState(postAttachmentsState);
  const [keyboardShow, setKeyboardShow] = useState<boolean>(false);

  const dTextInputStyles = useDTextInputStyles({});

  const styles = useStyles({
    baseTextInputStyle: dTextInputStyles.input,
    keyboardShow,
    bottomInset: bottom,
  });

  const {imageFromCamera, imageFromLibrary} = useImageFromDevice({
    onImageSelected: setCommentAttachment,
  });

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

  const rightButtonComponent = useMemo(() => {
    return (
      <Button
        mode="contained"
        size={32}
        textColor={theme.colors.white}
        backgroundColor={theme.colors.butterOrange01}
        disabled={commentAttachment ? false : comment.length === 0}
        additionalStyle={styles.postButton}
        onPress={handlePostComment}>
        {t('post')}
      </Button>
    );
  }, [comment, loading, commentAttachment]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? bottom + 40 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Shadow
        stretch={true}
        style={[styles.shadow, !keyboardShow ? {paddingBottom: bottom} : {}]}
        startColor="rgba(51, 51, 51, 0.1)"
        distance={30}>
        <View style={styles.container}>
          {profileImage ? (
            <FastImage source={profileImage} style={styles.profilePic} />
          ) : (
            <ActivityIndicator
              color={theme.colors.surfaceBlack}
              style={styles.profilePic}
            />
          )}
          <View style={styles.textInputContainer}>
            {commentAttachment && (
              <Spacer paddingBottom={12}>
                <SelectedCommentImage
                  handlePress={resetCommentAttachment}
                  source={{uri: commentAttachment.uri}}
                />
              </Spacer>
            )}
            <ScrollView
              keyboardShouldPersistTaps="always"
              overScrollMode="never"
              showsVerticalScrollIndicator
              contentContainerStyle={styles.textInputScrollContainer}>
              <TextInput
                ref={textInputRef}
                maxLength={EnvConfig.MAX_COMMENT_LENGTH}
                value={comment}
                onChangeText={text => {
                  setComment(text);
                }}
                multiline
                textBreakStrategy={undefined}
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
            rightComponent={rightButtonComponent}
            commentLength={comment.length}
          />
        )}
      </Shadow>
    </KeyboardAvoidingView>
  );
};

export default EnterCommentBottomBar;
