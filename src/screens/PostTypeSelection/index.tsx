import React from 'react';
import Typography from 'components/Typography';
import Button from 'components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {ActivityIndicator, Platform, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import PostTypeButton from 'screens/PostTypeSelection/PostTypeButton';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SELECT_POST_TYPE
>;

const PostTypeSelection = () => {
  const {t} = useTranslation('createPost');
  const styles = useStyles();
  const {goBack} = useNavigation<NavProps['navigation']>();
  const theme = useTheme();

  const [permissionsGranted, setPermissionsGranted] = React.useState<
    boolean | undefined
  >(undefined);

  const requestPermissions = React.useCallback(async () => {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    });

    // @ts-ignore
    const grantedPermissions = await requestMultiple([permission]);

    console.log(grantedPermissions);
    // @ts-ignore
    return grantedPermissions[permission] === 'granted';
  }, []);

  // check if storage permissions have been granted
  React.useEffect(() => {
    requestPermissions().then(result => setPermissionsGranted(result));
  }, []);

  const HeaderButton = React.useMemo(() => {
    return (
      <Typography.Subtitle2
        onPress={goBack}
        style={{marginLeft: theme.spacing.s, color: theme.colors.surfaceBlack}}>
        {t('common:cancel')}
      </Typography.Subtitle2>
    );
  }, []);

  const handlePressImage = React.useCallback(() => ({}), []);

  const handlePressText = React.useCallback(() => ({}), []);

  const renderContent = React.useMemo(() => {
    if (permissionsGranted === false) {
      return (
        <View style={styles.permissionsGroup}>
          <Typography.H4 style={styles.textStyle}>
            {t('accessYourPhotos')}
          </Typography.H4>

          <Spacer paddingTop={theme.spacing.s} paddingBottom={theme.spacing.xl}>
            <Typography.Body6 style={styles.textStyle}>
              {t('noAccess')}
            </Typography.Body6>
          </Spacer>

          <Button mode="gradientFilled" onPress={requestPermissions}>
            {t('allowAccess')}
          </Button>
        </View>
      );
    }
    if (permissionsGranted) {
      return (
        <View style={styles.permissionsGroup}>
          <Typography.Body6>granted</Typography.Body6>
        </View>
      );
    }

    return (
      <View style={styles.permissionsGroup}>
        <ActivityIndicator style={{alignSelf: 'center'}} />
      </View>
    );
  }, [permissionsGranted]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']}>{HeaderButton}</SafeAreaView>

      <View style={styles.buttonContainer}>
        <PostTypeButton type="image" handlePress={handlePressImage} />
        <PostTypeButton type="text" handlePress={handlePressText} />
      </View>

      {renderContent}
    </View>
  );
};

export default PostTypeSelection;
