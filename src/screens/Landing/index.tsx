import DView from 'components/DView';
import React from 'react';
import {dummyAvatar, landingBG, ledgerLIcon} from 'assets/images';
import {Image, TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {MNEMONIC_INPUT_MODE} from 'screens/MnemonicInput';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = () => {
  const theme = useTheme();
  const {t} = useTranslation('landing');

  const {navigate} = useNavigation<NavProps['navigation']>();

  const styles = useStyles();

  return (
    <DView
      statusBarProps={{translucent: true}}
      background={landingBG}
      style={styles.container}>
      <Image source={dummyAvatar} style={styles.dummyAvatar} />

      <Typography.H4 style={styles.headerStyle}>{t('header')}</Typography.H4>
      <View style={{alignSelf: 'stretch'}}>
        <Button
          mode="contained"
          style={{backgroundColor: theme.colors.white}}
          labelStyle={{color: theme.colors.desmosOrange01}}
          onPress={() => navigate(ROUTES.SIGNUP)}>
          {t('signUp')}
        </Button>

        <Spacer paddingVertical={theme.spacing.l}>
          <Button
            style={{borderColor: theme.colors.white}}
            labelStyle={{color: theme.colors.white}}
            mode="outlined"
            onPress={() =>
              navigate(ROUTES.MNEMONIC_INPUT, {
                mode: MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
              })
            }>
            {t('importMnemonic')}
          </Button>
        </Spacer>
      </View>

      <TouchableOpacity
        style={styles.connectLedgerButton}
        onPress={() => {
          navigate(ROUTES.LOOKING_FOR_DEVICES);
        }}>
        <Image source={ledgerLIcon} style={styles.connectLedgerImage} />

        <Typography.Button1 style={{color: theme.colors.white}}>
          {t('connectLedger')}
        </Typography.Button1>
      </TouchableOpacity>
    </DView>
  );
};

export default Landing;
