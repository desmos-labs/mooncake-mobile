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
import {postBG} from 'assets/images';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import RadialTextCounter from 'components/RadialTextCounter';
import EnvConfig from 'config/EnvConfig';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';
import BottomBar from './components/BottomBar';

const CreateTextPost = () => {
  const styles = useStyles();
  const theme = useTheme();

  const {t} = useTranslation('createPost');

  const [backgroundIndex, setBackgroundIndex] = React.useState(
    _.random(0, postBG.length),
  );
  const [text, setText] = React.useState('');

  const inputRef = useRef<any>();

  const handlePressBGButton = React.useCallback(() => {
    setBackgroundIndex(prev => (prev < postBG.length ? prev + 1 : 0));
  }, [backgroundIndex]);

  const inputOpacity = React.useMemo(() => {
    if (!inputRef.current || text.length === 0) return 0.8;
    return 1;
  }, [inputRef.current, text]);

  const handlePostPressed = React.useCallback(() => {
    if (inputRef.current) {
      const focused = inputRef.current?.isFocused();

      if (focused) {
        inputRef.current?.blur();
      } else inputRef.current?.focus();
    }
  }, [inputRef.current]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeAreaContainer}>
        <TouchableOpacity
          onPress={handlePostPressed}
          activeOpacity={1}
          style={styles.postContainer}>
          <Image source={postBG[backgroundIndex]} style={styles.background} />

          <View style={styles.headerGroup}>
            <Icon
              name="angle-left"
              color={theme.colors.white}
              size={32}
              allowFontScaling
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
              maxLength={EnvConfig.MAX_COMMENT_LENGTH}
              ref={inputRef}
              value={text}
              multiline
              onChangeText={setText}
              placeholder={t('tapToType')}
              style={[styles.inputStyle, {opacity: inputOpacity}]}
              placeholderTextColor="#FFFFFF"
            />
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </SafeAreaView>

      <BottomBar
        handlePressPost={() => {
          console.log('post');
        }}
        handlePressGallery={() => console.log('gallery')}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}
        style={styles.textCounterContainer}>
        <RadialTextCounter
          max={EnvConfig.MAX_COMMENT_LENGTH}
          current={text.length}
          customEmptyColor="rgba(255,255,255,0.3)"
          customFillColor={theme.colors.white}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateTextPost;
