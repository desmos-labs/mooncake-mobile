import React, {useEffect, useMemo, useRef, useState} from 'react';
import Button from 'components/Button';
import MediaBottomPanel from 'components/MediaBottomPanel';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Typography from 'components/Typography';
import EnvConfig from 'config/EnvConfig';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardEventName,
  Platform,
  TextInput,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import ImageButton from 'components/ImageButton';
import {expandCommentIcon} from 'assets/images';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {postAttachmentsState, postTextState} from '@recoil/sharedPostState';
import SelectedCommentImage from 'components/SelectedCommentImage';
import useImageFromDevice from 'hooks/useImageFromDevice';
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
   * Focus the text input when navigating to this screen
   */
  focusTextInput: boolean;

  /**
   * Callback to handle when the user submits a comment.
   */
  handlePostComment: () => void;

  /**
   * Is an action being processed? (block out interaction buttons)
   */
  loading?: boolean;
};

const EnterCommentBottomBar: React.FC<Props> = ({
  profileImage,
  onIconPress,
  focusTextInput,
  handlePostComment,
  loading,
}) => {
  const {t} = useTranslation('comment');
  const styles = useStyles();
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const [comment, setComment] = useRecoilState(postTextState);
  const [commentAttachment, setCommentAttachment] =
    useRecoilState(postAttachmentsState);
  const resetCommentAttachment = useResetRecoilState(postAttachmentsState);
  const [keyboardShow, setKeyboardShow] = useState<boolean>(false);
  const textInputRef = useRef<any>();

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

  useEffect(() => {
    if (focusTextInput) {
      // It was too fast, so we need to slow it down to be able to render everything else before focussing this input
      setTimeout(() => textInputRef?.current?.focus());
    }
  }, [focusTextInput]);

  const rightButtonComponent = useMemo(() => {
    return (
      <Button
        mode="contained"
        disabled={comment.length === 0}
        style={styles.postButton}
        loading={loading}
        onPress={handlePostComment}>
        <Typography.Button3 style={{color: theme.colors.white}}>
          {t('post')}
        </Typography.Button3>
      </Button>
    );
  }, [comment, loading]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? bottom + 35 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Shadow
        viewStyle={[
          styles.shadow,
          !keyboardShow ? {paddingBottom: bottom} : {},
        ]}
        startColor="rgba(51, 51, 51, 0.15)"
        distance={30}
        radius={0}>
        <View style={styles.container}>
          {profileImage ? (
            <Image source={profileImage} style={styles.profilePic} />
          ) : (
            <ActivityIndicator style={styles.profilePic} />
          )}
          <View style={styles.textInputContainer}>
            {commentAttachment && (
              <SelectedCommentImage
                handlePress={resetCommentAttachment}
                source={{uri: commentAttachment.uri}}
              />
            )}
            <View style={{flexDirection: 'row'}}>
              <TextInput
                ref={textInputRef}
                maxLength={EnvConfig.MAX_COMMENT_LENGTH}
                value={comment}
                onChangeText={text => setComment(text)}
                multiline
                style={styles.textInput}
                placeholderTextColor={theme.colors.grey02}
                placeholder={t('write a comment')}
                textAlignVertical="center"
              />

              <View
                pointerEvents={keyboardShow ? 'auto' : 'none'}
                style={{
                  opacity: keyboardShow ? 1 : 0,
                  alignSelf: 'flex-end',
                }}>
                <ImageButton
                  style={{
                    width: 24,
                    height: 24,
                    opacity: keyboardShow ? 1 : 0,
                    bottom: Platform.select({
                      ios: 0,
                      android: 8,
                    }),
                  }}
                  image={expandCommentIcon}
                  onPress={onIconPress}
                />
              </View>
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
