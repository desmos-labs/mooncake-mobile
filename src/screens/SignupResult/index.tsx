import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {modalSuccess} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

declare type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SIGNUP_RESULT
>;

const SignupResult = () => {
  const {navigate, reset} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('signup');
  const styles = useStyles();
  const theme = useTheme();

  return (
    <DView style={styles.root} topBar={<TopBar />}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <FastImage
          resizeMode="cover"
          source={modalSuccess}
          style={styles.image}
        />
        <Spacer paddingTop={60} />
        <View style={{alignItems: 'center'}}>
          <Typography.H4>{t('congratulations')}</Typography.H4>
          <Spacer paddingTop={theme.spacing.s} />
          <Typography.Body6>{t('profile created')}</Typography.Body6>
        </View>
        <Spacer paddingTop={60} />
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={() =>
            reset({
              index: 0,
              routes: [
                {
                  name: ROUTES.BOTTOM_TABS,
                },
              ],
            })
          }>
          <Typography.Button2 style={{color: theme.colors.white}}>
            {t('welcome to butter')}
          </Typography.Button2>
        </Button>
        <Spacer paddingTop={theme.spacing.m} />
        <Button
          mode="outlined"
          color={theme.colors.surfaceBlack}
          onPress={() => console.log('test')}>
          <Typography.Button2>{t('backup phrase')}</Typography.Button2>
        </Button>
        <Spacer paddingTop={theme.spacing.m} />
        <Button
          mode="text"
          color={theme.colors.surfaceBlack}
          onPress={() => navigate(ROUTES.BACKUP_PHRASE_BOTTOM_MODAL)}>
          <Typography.Subtitle4>{t('why backup')}</Typography.Subtitle4>
        </Button>
      </View>
    </DView>
  );
};

export default SignupResult;
