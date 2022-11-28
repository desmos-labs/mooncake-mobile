import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  infoIcon,
  invite1,
  invite2,
  invite3,
  invite4,
  invitesBanner,
  inviteUserIcon,
} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import StepComponent from 'screens/Invites/components/StepComponent';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.INVITES>;

const Invites = () => {
  const styles = useStyles();
  const {t} = useTranslation('invites');
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();

  const rightElement = useMemo(() => {
    return (
      <TouchableOpacity onPress={() => navigate(ROUTES.MANAGE_INVITES)}>
        <Typography.Button2>{t('invites')}</Typography.Button2>
      </TouchableOpacity>
    );
  }, []);

  return (
    <DView
      backgroundColor={theme.colors.white}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      scrollable={true}
      topBar={
        <TopBar
          rightElement={rightElement}
          style={{paddingBottom: theme.spacing.m}}
        />
      }>
      <FastImage
        resizeMode="cover"
        source={invitesBanner}
        style={{
          width: 375,
          height: 375,
          marginTop: -60,
          alignSelf: 'center',
          backgroundColor: 'transparent',
        }}
      />

      <View style={{padding: theme.spacing.m, alignItems: 'center'}}>
        <Typography.H3>{t('invite friends')}</Typography.H3>
        <Typography.Body6>{t('refer a friend')}</Typography.Body6>
        <Spacer paddingVertical={theme.spacing.s} />
      </View>
      <Button
        color={theme.colors.surfaceBlack}
        style={{marginHorizontal: theme.spacing.m}}
        mode="contained">
        {t('generate invite')}
      </Button>
      <Spacer paddingVertical={theme.spacing.m} />
      <View style={{alignItems: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Typography.Subtitle2>
            {t('points', {number: 0})}
          </Typography.Subtitle2>
          <Typography.Body5> {t('requried')}</Typography.Body5>
          <ImageButton
            onPress={() => navigate(ROUTES.IMPACT_POINTS_MODAL)}
            image={infoIcon}
            style={{width: 18, height: 18, marginLeft: 4}}
          />
        </View>
        <Spacer paddingTop={6} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={inviteUserIcon}
            style={{width: 18, height: 18, marginRight: 4}}
          />
          <Typography.Body6 style={{color: theme.colors.midGrey}}>
            {t('invites shared', {number: 0})}
          </Typography.Body6>
        </View>
      </View>
      <Spacer paddingVertical={16} />
      <View style={{paddingHorizontal: theme.spacing.m}}>
        <Typography.Subtitle2>{t('invite steps')}</Typography.Subtitle2>
        <View style={{padding: theme.spacing.m}}>
          <StepComponent
            image={invite1}
            number={1}
            text={t('generate invite')}
          />

          <StepComponent image={invite2} number={2} text={t('share invite')} />
          <StepComponent image={invite3} number={3} text={t('wait redeem')} />
          <StepComponent
            image={invite4}
            number={4}
            text={t('get rewards')}
            disableLine={true}
          />
        </View>
      </View>
    </DView>
  );
};

export default Invites;
