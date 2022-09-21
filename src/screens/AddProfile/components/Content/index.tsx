import {StackActions, useNavigation} from '@react-navigation/native';
import {mnemonicState} from '@recoil/connectChainState';
import {useLoadProfiles} from '@recoil/profiles';
import {defaultProfilePic} from 'assets/images';
import Typography from 'components/Typography';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {getAccounts} from 'lib/SecureStorage';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import {ChainAccount} from 'types/chains';
import AddProfileBadgeGroup, {ProfileRadioValue} from '../AddProfileBadgeGroup';
import useStyles from './useStyles';

const Content: FC = () => {
  const styles = useStyles();
  const {t} = useTranslation();
  const theme = useTheme();
  const {dispatch} = useNavigation();

  const {profiles} = useLoadProfiles();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [canAdd, setCanAdd] = useState(false);
  const [accountByAddress, setAccountByAddress] = useState<
    Map<string, ChainAccount>
  >(new Map());
  const [values, setValues] = useState<ProfileRadioValue[]>([]);
  const unlockWallet = useUnlockWallet();
  const setMnemonic = useSetRecoilState(mnemonicState);

  const profilesByAddress = useMemo(
    () =>
      profiles.reduce(
        (map, profile) => map.set(profile.address, profile),
        new Map<string, ProfileData>(),
      ),
    [profiles],
  );
  useEffect(() => {
    getAccounts().then(accounts => {
      setCanAdd(
        accounts?.some(({address}) => !profilesByAddress.has(address)) ?? false,
      );
      setAccountByAddress(
        accounts?.reduce(
          (map, account) => map.set(account.address, account),
          new Map(),
        ) ?? new Map(),
      );
      setValues(
        accounts
          ?.filter(({address}) => address)
          .map(({address}) => {
            const profile = profilesByAddress.get(address);
            return {
              id: address,
              nickname: profile?.nickname ?? '',
              dTag: profile?.dtag ? `@${profile.dtag}` : address,
              profilePicture: profile?.profile_pic
                ? {uri: profile.profile_pic}
                : defaultProfilePic,
              isSelected: selectedAddress === address,
              disabled: !!profile,
            };
          }) ?? [],
      );
    });
  }, [profiles, selectedAddress]);

  const handleSelect = useCallback((id: string) => setSelectedAddress(id), []);
  const handleCreateDesmosProfile = useCallback(
    () => dispatch(StackActions.push(ROUTES.CREATE_DESMOS_PROFILE, {})),
    [],
  );
  const handleConfirmPressed = useCallback(async () => {
    if (!selectedAddress) return;
    const account = accountByAddress.get(selectedAddress);
    if (!account) return;
    console.log({beforeUnlockWallet: account});
    const unlockResult = await unlockWallet(account);
    if (!unlockResult) return;
    console.log({afterUnlockWallet: account});
    const {mnemonic} = unlockResult;
    setMnemonic(mnemonic!);
    dispatch(StackActions.push(ROUTES.CONNECT_ADDRESS_GENERAL));
  }, [unlockWallet, selectedAddress]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        <AddProfileBadgeGroup values={values} onSelect={handleSelect} />
      </ScrollView>
      {canAdd ? (
        <>
          <Button
            mode="text"
            color={theme.colors.surfaceBlack}
            style={styles.button}
            labelStyle={styles.textButton}
            onPress={handleCreateDesmosProfile}>
            <Typography.Subtitle3>
              {t('addProfile:orCreateADesmosProfile')}
            </Typography.Subtitle3>
          </Button>
          <Button
            mode="contained"
            color={theme.colors.surfaceBlack}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            disabled={!selectedAddress}
            onPress={handleConfirmPressed}>
            <Typography.Button2>{t('common:confirm')}</Typography.Button2>
          </Button>
        </>
      ) : (
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          onPress={handleCreateDesmosProfile}>
          <Typography.Subtitle2>
            {t('noDtagFound:createDesmosProfile')}
          </Typography.Subtitle2>
        </Button>
      )}
    </View>
  );
};

export default Content;
