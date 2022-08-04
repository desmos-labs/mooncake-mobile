import React from 'react';
import DView from 'components/DView';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Typography from 'components/Typography';
import TopBar from 'components/TopBar';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import useStyles from '../useStyles';

const ConnectAddressGeneral = () => {
  // placeholder
  const navigation = useNavigation<any>();

  const {t} = useTranslation('connectAddress');

  const styles = useStyles();

  const theme = useTheme();

  const SwitchToAdvancedButton = React.useMemo(() => {
    return (
      <Typography.Button2 style={styles.modeButtonText} onPress={() => {}}>
        {t('advanced')}
      </Typography.Button2>
    );
  }, []);

  return (
    <DView
      topBar={
        <TopBar
          stackProps={{navigation}}
          rightElement={SwitchToAdvancedButton}
        />
      }>
      <Typography.H5 style={styles.textStyle}>{t('header')}</Typography.H5>

      <Spacer paddingVertical={theme.spacing.l}>
        <Typography.Body6 style={styles.textStyle}>
          {t('selectAnAccount')}
        </Typography.Body6>
      </Spacer>
    </DView>
  );
};

export default ConnectAddressGeneral;
