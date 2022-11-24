import {useLazyQuery} from '@apollo/client';
import {toBase64} from '@cosmjs/encoding';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import profilesState from '@recoil/profiles';
import Button from 'components/Button';
import Typography from 'components/Typography';
import useGenerateAccountsToAdd from 'hooks/useGenerateAccountsToAdd';
import LocalWallet from 'lib/LocalWallet';
import {saveLocalWallet, saveMnemonic, saveNewAccount} from 'lib/SecureStorage';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import AddProfileBadge from 'screens/AddProfile/components/AddProfileBadge';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import {ChainAccount, ChainAccountType} from 'types/chains';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ADD_PROFILE>;

type ContentProps = {
  mnemonic?: string;
  password?: string;
};

const Content = ({mnemonic, password}: ContentProps) => {
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [globalLoading, setGlobalLoading] = useState(true);
  const [fetchLimit, setFetchLimit] = useState(10);
  const [fetchedAccounts, setFetchedAccounts] = useState<any[]>([]);
  const [generatedWallets, setGeneratedWallets] = useState<any[]>([]);
  const [profiles] = useRecoilState(profilesState);
  const [getProfiles] = useLazyQuery(GetProfileForAddresses);
  const {generateAccounts} = useGenerateAccountsToAdd();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation();
  const isAlreadyAdded = (address: string) => {
    return profiles.findIndex(profile => profile.address === address) !== -1;
  };

  const generateAccountsAndFetchProfiles = useCallback(async () => {
    try {
      setGlobalLoading(true);
      const result = await generateAccounts(0, 10, mnemonic);
      if (result) {
        setGeneratedWallets(result);
        const addressesToFetch = result.map(
          (account: {address: any}) => account.address,
        );
        await getProfiles({
          variables: {
            addresses: addressesToFetch,
          },
        }).then(res => setFetchedAccounts(res.data.profile));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setGlobalLoading(false), 1000);
    }
  }, [generateAccounts, getProfiles, mnemonic]);

  const generateMoreAccountsAndFetchProfiles = useCallback(async () => {
    try {
      setGlobalLoading(true);
      const result = await generateAccounts(
        fetchLimit,
        fetchLimit + 10,
        mnemonic,
      );
      if (result) {
        const addressesToFetch = result.map(
          (account: {address: any}) => account.address,
        );
        await getProfiles({
          variables: {
            addresses: addressesToFetch,
          },
        }).then(res =>
          setFetchedAccounts(prev => [...prev, ...res.data.profile]),
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setGlobalLoading(false), 1000);
      setFetchLimit(prev => prev + 10);
    }
  }, [generateAccounts, getProfiles, mnemonic]);

  const createNewAccount = useCallback(async () => {
    try {
      const walletToSave = generatedWallets.find(
        wallet => wallet.address === selectedAddress,
      );
      const deserializedWallet = await LocalWallet.deserialize(
        walletToSave.signer as string,
      );
      const chainAccount: ChainAccount = {
        address: deserializedWallet.bech32Address,
        type: ChainAccountType.Local,
        pubKey: toBase64(deserializedWallet.publicKey),
        hdPath: walletToSave.hdPath,
        signAlgorithm: 'secp256k1',
      };

      await saveLocalWallet(deserializedWallet, password!);
      await saveMnemonic(
        deserializedWallet.bech32Address,
        mnemonic!,
        password!,
      );
      await saveNewAccount(chainAccount);
      navigate(ROUTES.SETTINGS_PROFILES);
    } catch (e) {
      console.error(e);
    }
  }, [generatedWallets, selectedAddress]);

  useEffect(() => {
    generateAccountsAndFetchProfiles();
  }, []);

  return (
    <View style={styles.content}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Typography.Body6>
          Searches the first {fetchLimit} accounts
        </Typography.Body6>
        <Button mode="text">
          <Typography.Button2
            style={{color: theme.colors.butterOrange01}}
            onPress={generateMoreAccountsAndFetchProfiles}>
            {t('search more')}
          </Typography.Button2>
        </Button>
      </View>
      <ScrollView
        style={{marginHorizontal: -theme.spacing.m}}
        contentContainerStyle={{padding: theme.spacing.m}}>
        {globalLoading ? (
          <ActivityIndicator />
        ) : (
          fetchedAccounts.map((value: any) => {
            console.log(value);
            return (
              <AddProfileBadge
                disabled={isAlreadyAdded(value.address)}
                value={{
                  ...value,
                  isSelected: selectedAddress === value.address,
                }}
                onSelect={address => setSelectedAddress(address)}
                key={value.dtag}
              />
            );
          })
        )}
      </ScrollView>
      <View>
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={createNewAccount}>
          {t('confirm')}
        </Button>
        <Button
          onPress={() =>
            navigate(ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL, {
              mnemonic,
              password,
            })
          }
          style={{paddingVertical: theme.spacing.m}}
          mode="text"
          color={theme.colors.surfaceBlack}>
          create desmos profile
        </Button>
      </View>
    </View>
  );
};

export default Content;
