import {useLoadProfiles} from '@recoil/profiles';
import {getAccounts} from 'lib/SecureStorage';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {ChainAccount} from 'types/chains';
// import SettingsProfileBadgeGroup from '../SettingsProfileBadgeGroup';
import useStyles from './useStyles';

const Content: FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [accounts, setAccounts] = useState<ChainAccount[]>();
  const {profiles} = useLoadProfiles();
  const theme = useTheme();
  const availableAccounts = useMemo(() => {
    const addedAddresses = profiles.reduce(
      (set, {address}) => set.add(address),
      new Set<string>(),
    );
    return (
      accounts
        ?.filter(({address}) => !addedAddresses.has(address))
        .map(({address}) => address) ?? []
    );
  }, [accounts, profiles]);
  useEffect(() => {
    getAccounts().then(accs => setAccounts(accs));
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        {/* <SettingsProfileBadgeGroup values={values} onSelect={index => {}} /> */}
      </ScrollView>
      {availableAccounts.length > 0 ? (
        <>
          <Button
            mode="text"
            color={theme.colors.surfaceBlack}
            style={styles.button}
            labelStyle={styles.textButton}
            onPress={() => {}}>
            {t('addProfile:orCreateADesmosProfile')}
          </Button>
          <Button
            mode="contained"
            color={theme.colors.surfaceBlack}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            onPress={() => {}}>
            {t('common:confirm')}
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={() => {}}>
          {t('noDtagFound:createDesmosProfile')}
        </Button>
      )}
    </View>
  );
};

export default Content;
