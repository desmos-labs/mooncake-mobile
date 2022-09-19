import {
  Header,
  StackHeaderProps,
  StackScreenProps,
} from '@react-navigation/stack';
import {useLoadProfiles} from '@recoil/profiles';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useMemo, useRef} from 'react';
import {defaultProfilePic} from 'assets/images';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SettingsProfileBadgeGroup from 'screens/Profiles/components/SettingsProfileBadgeGroup';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ADD_PROFILE>;

const HeaderBackImage = () => {
  const styles = useStyles();
  return (
    <Icon
      name="angle-left"
      color="black"
      size={24}
      allowFontScaling
      style={styles.headerBackImage}
    />
  );
};

/* A React component that renders the header for the following and followers screen. */
export const AddProfileHeader: FC<StackHeaderProps> = ({options, ...rest}) => {
  return (
    <Header
      {...rest}
      options={{
        ...options,
        headerShadowVisible: false,
        headerStyle: {borderWidth: 0},
        headerBackImage: HeaderBackImage,
        headerBackTitleVisible: false,
      }}
    />
  );
};

/* A React component for the following and followers screen. */
const AddProfile: FC<NavProps> = () => {
  const {t} = useTranslation('addProfile');
  const styles = useStyles();
  const scrollRef = useRef(null);
  const [activeAddress] = useMMKVStorage<string | undefined>(
    MMKVKEYS.ACTIVE_ACCOUNT_ADDR,
  );
  const {profiles} = useLoadProfiles();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const values = useMemo(() => {
    if (profiles.length === 0) return [];
    return profiles.map(profile => {
      return {
        nickname: profile.nickname,
        dTag: profile.dtag,
        profilePicture: profile.profile_pic
          ? {uri: profile.profile_pic}
          : defaultProfilePic,
        isSelected: activeAddress === profile.address,
      };
    });
  }, [profiles]);

  return (
    <View style={styles.container}>
      <Typography.H3>{t('addProfile')}</Typography.H3>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        <SettingsProfileBadgeGroup
          simultaneousHandlers={scrollRef}
          values={values}
          onSelect={doNothing}
          onEditProfile={doNothing}
          onRemoveProfile={doNothing}
        />
      </ScrollView>
    </View>
  );
};

function doNothing() {}

export default AddProfile;
