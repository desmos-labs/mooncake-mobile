import {StackScreenProps} from '@react-navigation/stack';
import {
  desmosIcon,
  discordIcon,
  githubIcon,
  mediumIcon,
  telegramIcon,
  twitterIcon,
} from 'assets/images';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import SettingsCommunityButton from 'screens/Settings/components/SettingsCommunityButton';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const Community: React.FC<Props> = () => {
  const {t} = useTranslation('settings');
  const styles = useStyles();

  const navigateToExternalSite = useCallback((url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  }, []);

  const navigateToTwitterApp = useCallback(() => {
    Linking.openURL('twitter://user?screen_name=DesmosNetwork').catch(() => {
      Linking.openURL('https://www.twitter.com/DesmosNetwork').catch(err =>
        console.error("Couldn't load page", err),
      );
    });
  }, []);

  return (
    <DView style={styles.root} topBar={<TopBar />}>
      <Typography.H3 style={styles.title}>{t('community')}</Typography.H3>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}
        showsVerticalScrollIndicator={false}>
        <SettingsCommunityButton
          title={t('website')}
          subtitle="desmos.network"
          image={desmosIcon}
          onPress={() => navigateToExternalSite('https://www.desmos.network/')}
        />
        <SettingsCommunityButton
          title={t('twitter')}
          subtitle="@DesmosNetwork"
          image={twitterIcon}
          onPress={navigateToTwitterApp}
        />
        <SettingsCommunityButton
          title={t('telegram')}
          subtitle="@DesmosNetwork"
          image={telegramIcon}
          onPress={() => navigateToExternalSite('https://t.me/desmosnetwork')}
        />
        <SettingsCommunityButton
          title={t('github')}
          subtitle="github.com/desmos-labs"
          image={githubIcon}
          onPress={() =>
            navigateToExternalSite('https://github.com/desmos-labs')
          }
        />
        <SettingsCommunityButton
          title={t('discord')}
          subtitle="https://discord.desmos.network"
          image={discordIcon}
          onPress={() =>
            navigateToExternalSite('https://discord.desmos.network')
          }
        />
        <SettingsCommunityButton
          title={t('medium')}
          subtitle="medium.com/desmosnetwork"
          image={mediumIcon}
          onPress={() =>
            navigateToExternalSite('https://medium.com/desmosnetwork')
          }
        />
      </ScrollView>
    </DView>
  );
};

export default Community;
