import React, {useRef} from 'react';
import {
  View,
  Image,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {postBG, whiteCross} from 'assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import RadialTextCounter from 'components/RadialTextCounter';
import EnvConfig from 'config/EnvConfig';
import _ from 'lodash';
import {useTheme} from 'react-native-paper';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {postParamsState} from '@recoil/postParamsState';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost';
import LoadingOverlay from 'components/LoadingOverlay';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {postAttachmentsState, postTextState} from '@recoil/sharedPostState';
import ImageButton from 'components/ImageButton';
import {addAlphaToHex} from 'config/theme';
import {Asset} from 'react-native-image-picker';
import useImageFromDevice from 'hooks/useImageFromDevice';
import BottomBar from './components/BottomBar';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_TEXT_POST
>;

const CreateTextPost = () => {
  const styles = useStyles();
  const theme = useTheme();

  const {t} = useTranslation('createPost');
  const postParams = useRecoilValue(postParamsState);
  const [sharedComment, setSharedComment] = useRecoilState(postTextState);
  const {createPost, loading} = useCreatePost();
  const {replace, goBack} = useNavigation<NavProps['navigation']>();
  const [inputFocused, setInputFocused] = React.useState(false);
  const setCommentAttachment = useSetRecoilState(postAttachmentsState);

  const imageSelectedCallback = React.useCallback((image: Asset) => {
    replace(ROUTES.ENTER_COMMENT, {isCreatePost: true});

    setCommentAttachment(image);
  }, []);

  const {imageFromCamera, imageFromLibrary} = useImageFromDevice({
    onImageSelected: imageSelectedCallback,
  });

  const [backgroundIndex, setBackgroundIndex] = React.useState(
    _.random(0, postBG.length),
  );
  const inputRef = useRef<any>();

  const handlePressBGButton = React.useCallback(() => {
    setBackgroundIndex(prev => (prev < postBG.length ? prev + 1 : 0));
  }, [backgroundIndex]);

  const inputOpacity = React.useMemo(() => {
    if (!inputRef.current || sharedComment.length === 0) return 0.8;
    return 1;
  }, [inputRef.current, sharedComment]);

  const handlePostPressed = React.useCallback(() => {
    if (inputRef.current) {
      const focused = inputRef.current?.isFocused();

      if (focused) {
        inputRef.current?.blur();
        setInputFocused(false);
      } else {
        inputRef.current?.focus();
        setInputFocused(true);
      }
    }
  }, [inputRef?.current?.isFocused()]);

  const handleSubmitPost = React.useCallback(async () => {
    const createPostResponse = await createPost({});

    if (createPostResponse) {
      goBack();
    }
  }, [createPost, sharedComment]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeAreaContainer}>
        <TouchableOpacity
          onPress={handlePostPressed}
          activeOpacity={1}
          style={styles.postContainer}>
          <Image source={postBG[backgroundIndex]} style={styles.background} />

          <View style={styles.headerGroup}>
            <ImageButton
              onPress={goBack}
              hitSlop={{top: 50, bottom: 50, right: 50, left: 50}}
              image={whiteCross}
              style={{
                width: 28,
                height: 28,
                resizeMode: 'contain',
              }}
            />

            <TouchableOpacity onPress={handlePressBGButton}>
              <Image
                source={postBG[backgroundIndex]}
                style={styles.switchBgButton}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
            keyboardVerticalOffset={50}>
            <TextInput
              maxLength={postParams.max_text_length}
              ref={inputRef}
              value={sharedComment}
              multiline
              onChangeText={setSharedComment}
              onPressIn={handlePostPressed}
              placeholder={inputFocused ? '' : t('tapToType')}
              style={[styles.inputStyle, {opacity: inputOpacity}]}
              placeholderTextColor={addAlphaToHex('#FFFFFF', 0.5)}
            />
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </SafeAreaView>

      <TouchableOpacity
        style={{zIndex: 2}}
        activeOpacity={1}
        onPress={handlePostPressed}>
        <BottomBar
          handlePressPost={handleSubmitPost}
          handlePressGallery={imageFromLibrary}
          handlePressCamera={imageFromCamera}
        />
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
        style={styles.textCounterContainer}
        // android pushes the text counter up excessively, so we need to use this offset
        keyboardVerticalOffset={Platform.select({
          android: -200,
        })}>
        <RadialTextCounter
          max={EnvConfig.MAX_COMMENT_LENGTH}
          current={sharedComment.length}
          customEmptyColor="rgba(255,255,255,0.3)"
          customFillColor={theme.colors.white}
        />
      </KeyboardAvoidingView>
      <LoadingOverlay isVisible={loading} />
    </View>
  );
};

export default CreateTextPost;
