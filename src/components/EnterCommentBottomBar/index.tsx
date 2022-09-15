import React, {useEffect, useMemo, useRef, useState} from 'react';
import Button from 'components/Button';
import DTextInput from 'components/DTextInput';
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
import useStyles from './useStyles';

export type Props = {
  /**
   * Source of the image to display
   */
  profileImage: React.ComponentProps<typeof ProfileHeaderButton>['imageSrc'];
  // /**
  //  * Action to execute when the right icon is pressed
  //  */
  // onIconPress: () => void;
  /**
   * Focus the text input when navigating to this screen
   */
  focusTextInput: boolean;
};

const EnterCommentBottomBar: React.FC<Props> = ({
  profileImage,
  // onIconPress,
  focusTextInput,
}) => {
  const {t} = useTranslation('comment');
  const styles = useStyles();
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const [comment, setComment] = useState<string>('');
  const [keyboardShow, setKeyboardShow] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.select({
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
        mode="gradientFilled"
        disabled={comment.length === 0}
        containerStyle={styles.postButton}
        onPress={() => console.log('post it')}>
        <Typography.Button3 style={{color: theme.colors.white}}>
          {t('post')}
        </Typography.Button3>
      </Button>
    );
  }, [comment]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? bottom + 20 : 0}
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}>
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
          <DTextInput
            inputRef={textInputRef}
            maxLength={EnvConfig.MAX_COMMENT_LENGTH}
            value={comment}
            onChangeText={text => setComment(text)}
            multiline={true}
            style={styles.textInput}
            placeholder={t('write a comment')}
            textAlignVertical="center"
            // rightElement={
            //   <ImageButton image={expandCommentIcon} onPress={onIconPress} />
            // }
          />
        </View>
        {keyboardShow && (
          <MediaBottomPanel
            imageSelected={false}
            handlePressGallery={() => console.log('test')}
            handlePressCamera={() => console.log('test')}
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
