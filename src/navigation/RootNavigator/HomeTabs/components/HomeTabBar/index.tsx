import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {butterflyLandingIcon, homeInviteIcon} from 'assets/images';
import HomeSearchBar from 'components/HomeSearchBar';
import ImageButton from 'components/ImageButton';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import PostTypeTab from 'screens/Home/components/PostTypeTab';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

const HomeTabBar = ({state, position, navigation}: MaterialTopTabBarProps) => {
  const styles = useStyles();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FastImage
          tintColor={theme.colors.butterOrange01}
          style={styles.butterflyImage}
          source={butterflyLandingIcon}
        />

        <HomeSearchBar
          searchPlaceHolder="Search something"
          handleChange={() => console.log('test')}
        />

        <ImageButton
          style={styles.rightButton}
          image={homeInviteIcon}
          onPress={() => navigate(ROUTES.INVITES)}
        />
      </View>

      <View style={styles.tabContainer}>
        <PostTypeTab
          state={state}
          position={position}
          navigation={navigation}
        />
      </View>
    </View>
  );
};

export default HomeTabBar;
