import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import profilesState from '@recoil/profiles';
import Button from 'components/Button';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import AddProfileBadge from 'screens/AddProfile/components/AddProfileBadge';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import useHooks from '../../useHooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.ADD_PROFILE>;

type ContentProps = {
  mnemonic: string | undefined;
};

const Content: FC<ContentProps> = ({mnemonic}) => {
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [globalLoading, setGlobalLoading] = useState(true);
  const [fetchLimit, setFetchLimit] = useState(10);
  const [fetchedAccounts, setFetchedAccounts] = useState<any[]>([]);
  const [profiles] = useRecoilState(profilesState);
  const [getProfiles] = useLazyQuery(GetProfileForAddresses);
  const {generateAccounts} = useHooks();
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

  useEffect(() => {
    generateAccountsAndFetchProfiles();
  }, []);

  useEffect(() => {
    console.log(fetchedAccounts);
  }, [fetchedAccounts]);

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
        <Button mode="contained" color={theme.colors.surfaceBlack}>
          {t('confirm')}
        </Button>
        <Button
          onPress={() =>
            navigate(ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL, {mnemonic})
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
