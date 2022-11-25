import {invitesBanner} from 'assets/images';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

/*
export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.INVITES>;
*/

const Invites = () => {
  const styles = useStyles();
  const {t} = useTranslation('invites');
  const theme = useTheme();
  /*
  const {navigate} = useNavigation<NavProps['navigation']>();
*/

  const rightElement = useMemo(() => {
    return (
      <TouchableOpacity onPress={() => console.log('invites')}>
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
      topBar={<TopBar rightElement={rightElement} />}>
      <FastImage
        resizeMode="cover"
        source={invitesBanner}
        style={{width: 375, height: 375}}
      />
      <View style={{padding: theme.spacing.m, alignItems: 'center'}}>
        <Typography.H3>{t('invite friends')}</Typography.H3>
        <Typography.Body6>{t('refer a friend')}</Typography.Body6>
      </View>
    </DView>
  );
};

export default Invites;
