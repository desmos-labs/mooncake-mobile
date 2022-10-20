import {StackScreenProps} from '@react-navigation/stack';
import {twitterIcon} from 'assets/images';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import SettingsCommunityButton from './components/SettingsCommunityButton';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const Community: React.FC<Props> = () => {
  const {t} = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();

  const navigateToTwitterApp = useCallback(() => {
    Linking.openURL('twitter://user?screen_name=ButterDApp').catch(() => {
      Linking.openURL('https://www.twitter.com/ButterDApp').catch(err =>
        console.error("Couldn't load page", err),
      );
    });
  }, []);

  return (
    <DView
      style={styles.root}
      topBar={<TopBar />}
      backgroundColor={theme.colors.white}>
      <Typography.H3 style={styles.title}>{t('community')}</Typography.H3>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}
        showsVerticalScrollIndicator={false}>
        <SettingsCommunityButton
          title={t('twitter')}
          subtitle="@ButterDApp"
          image={twitterIcon}
          onPress={navigateToTwitterApp}
        />
      </ScrollView>
    </DView>
  );
};

export default Community;
