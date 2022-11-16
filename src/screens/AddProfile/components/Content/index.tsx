import {useLazyQuery} from '@apollo/client';
import useGenerateAccountsFromMnemonic from 'hooks/useGenerateAccountsFromMnemonic';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import AddProfileBadge from 'screens/AddProfile/components/AddProfileBadge';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import useStyles from './useStyles';

type ContentProps = {
  mnemonic: string | undefined;
};

const Content: FC<ContentProps> = ({mnemonic}) => {
  const [globalLoading, setGlobalLoading] = useState(true);
  const [fetchedAccounts, setFetchedAccounts] = useState([]);
  const [getProfiles] = useLazyQuery(GetProfileForAddresses);
  const styles = useStyles();
  const theme = useTheme();
  const {generateAccounts, loading, accounts} =
    useGenerateAccountsFromMnemonic(mnemonic);

  const generateAccountsAndFetchProfiles = useCallback(async () => {
    try {
      setGlobalLoading(true);
      await generateAccounts(10, 0);
      if (!loading) {
        const addressesToFetch = accounts.map(
          (account: {address: any}) => account.address,
        );
        console.log(addressesToFetch);
        await getProfiles({
          variables: {
            addresses: addressesToFetch,
          },
        }).then(res => setFetchedAccounts(res.data.profile));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGlobalLoading(false);
    }
  }, [accounts, generateAccounts, getProfiles, loading]);

  useEffect(() => {
    generateAccountsAndFetchProfiles();
  }, [generateAccountsAndFetchProfiles]);

  return (
    <View style={styles.content}>
      <ScrollView contentContainerStyle={{paddingHorizontal: theme.spacing.m}}>
        {globalLoading ? (
          <ActivityIndicator />
        ) : (
          fetchedAccounts.map((value: any) => {
            return (
              <AddProfileBadge
                value={value}
                onSelect={() => console.log('test')}
                key={value.dtag}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default Content;
