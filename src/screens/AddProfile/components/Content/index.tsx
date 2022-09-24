import React, {FC, Suspense, useCallback, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {OfflineSigner} from '@cosmjs/proto-signing';
import {ActivityIndicator} from 'react-native-paper';
import AddProfileBadgeGroup from '../AddProfileBadgeGroup';
import useStyles from './useStyles';
import generateAccounts from '../../generateAccounts';
import Buttons from '../Buttons';

/**
 * @property {OfflineSigner} signer - The offline signer that will be used to sign the transaction.
 * @property {string | undefined} mnemonic - The mnemonic phrase that was generated for the account.
 * @property {ChainAccountType} accountType - The type of account you want to create.
 * @property signAlgorithm - The algorithm used to sign the transaction.
 */
type ContentProps = {
  signer: OfflineSigner;
  mnemonic: string | undefined;
  accountType: ChainAccountType;
  signAlgorithm: ChainAccount['signAlgorithm'];
};

export type ProfilesByPage = {
  [page: number]: {
    accounts: ChainAccount[];
    profiles: ProfileData[];
  };
};

const Content: FC<ContentProps> = ({
  signer,
  mnemonic,
  accountType,
  signAlgorithm,
}) => {
  const styles = useStyles();

  const [accountsByPage, setAccountsByPage] = useState<Array<ChainAccount[]>>(
    [],
  );
  const [profileCountByPage, setProfileCountByPage] = useState<
    Record<number, number>
  >({});
  const [selectedProfiles, setSelectedProfiles] = useState<ProfileData[]>([]);

  /* Reset and generate the first page of accounts */
  useEffect(() => {
    setAccountsByPage([]);
    setProfileCountByPage([]);
    generateAccounts(
      signer,
      mnemonic,
      accountType,
      signAlgorithm,
      accountsByPage,
      setAccountsByPage,
      setProfileCountByPage,
    );
  }, [signer, mnemonic, accountType, signAlgorithm]);

  /* A callback function that is used to select a profile. */
  const handleSelect = useCallback((profile: ProfileData) => {
    setSelectedProfiles(prev => {
      const index = prev.findIndex(p => p.address === profile.address);
      if (index >= 0) {
        return prev.filter((_, i) => i !== index);
      } else {
        return prev.concat(profile);
      }
    });
  }, []);

  const setProfileCount = useCallback((page: number, count: number) => {
    setProfileCountByPage(prev => ({...prev, [page]: count}));
  }, []);

  return (
    <View style={styles.content}>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        {accountsByPage
          .map((accounts, page) => ({accounts, page}))
          .map(({accounts, page}) => (
            <Suspense fallback={<ActivityIndicator />} key={page}>
              {accounts ? (
                <AddProfileBadgeGroup
                  page={page}
                  addresses={accounts.map(account => account.address)}
                  selectedProfiles={selectedProfiles}
                  onSelect={handleSelect}
                  setProfileCount={setProfileCount}
                />
              ) : (
                <ActivityIndicator />
              )}
            </Suspense>
          ))}
      </ScrollView>
      <Buttons
        canAddProfile={accountsByPage.some(
          (accounts, page) =>
            page in profileCountByPage &&
            accounts.length > profileCountByPage[page],
        )}
        mnemonic={mnemonic}
        selectedProfiles={selectedProfiles}
      />
    </View>
  );
};

export default Content;
