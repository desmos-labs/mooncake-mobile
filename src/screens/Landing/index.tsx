import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {butterflyLandingIcon, landingBG, ledgerLIcon} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
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
      <Image source={butterflyLandingIcon} style={styles.dummyAvatar} />
      <Text style={styles.title} allowFontScaling>
        {t('butter')}
      </Text>
      <Text style={styles.subtitle} allowFontScaling>
        {t('header')}
      </Text>
      <View style={{alignSelf: 'stretch'}}>
        <Button
          mode="contained"
          style={{backgroundColor: theme.colors.white}}
          labelStyle={{color: theme.colors.surfaceBlack}}
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
