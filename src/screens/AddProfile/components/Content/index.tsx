import React, {
  FC,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ScrollView, View} from 'react-native';
import {ChainAccount} from 'types/chains';
import {OfflineSigner} from '@cosmjs/proto-signing';
import {ActivityIndicator} from 'react-native-paper';
import {useLoadProfiles} from '@recoil/profiles';
import {MAX_PAGE_TO_LOAD, PROFILE_PER_PAGE} from 'screens/AddProfile';
import AddProfileBadgeGroup from '../AddProfileBadgeGroup';
import useStyles from './useStyles';
import generateAccounts from '../../generateAccounts';
import Buttons from '../Buttons';
import AddProfileBadge, {profileToRadioValue} from '../AddProfileBadge';

export type ProfilesByPage = {
  [page: number]: {
    accounts: ChainAccount[];
    profiles: ProfileData[];
  };
};

/**
 * @property {number} page - The current page number.
 * @property {ChainAccount[]} accounts - ChainAccount[] - The list of accounts that are currently
 * loaded.
 * @property {Set<string>} loadedProfileAddresses - An array of ProfileData objects.
 * @property {ProfileData[]} selectedProfiles - The profiles that are currently selected.
 * @property handleSelect - This is a function that is called when a profile is selected.
 * @property setProfileCount - This is a function that sets the profile count for a given page.
 * @property loadMoreAccounts - This is a function that will be called when the user clicks the "Load
 * More" button.
 */
type ContentGroupProps = {
  page: number;
  accounts: ChainAccount[];
  selectedProfiles: ProfileData[];
  handleSelect: (profile: ProfileData) => void;
  setProfileCount: (page: number, count: number) => void;
  loadMoreAccounts: () => void;
};

/* A React component that is used to render a group of AddProfileBadge components. */
const ContentGroup: FC<ContentGroupProps> = ({
  page,
  accounts,
  selectedProfiles,
  handleSelect,
  setProfileCount,
  loadMoreAccounts,
}) => {
  const addresses = useMemo(
    () => accounts.map(account => account.address),
    [accounts],
  );
  return (
    <Suspense fallback={<ActivityIndicator />} key={page}>
      {accounts ? (
        <AddProfileBadgeGroup
          page={page}
          addresses={addresses}
          selectedProfiles={selectedProfiles}
          onSelect={handleSelect}
          setProfileCount={setProfileCount}
          loadMoreAccounts={loadMoreAccounts}
        />
      ) : (
        <ActivityIndicator />
      )}
    </Suspense>
  );
};

/**
 * @property {OfflineSigner} signer - The offline signer that will be used to sign the transaction.
 * @property {string | undefined} mnemonic - The mnemonic phrase that was generated for the account.
 * @property {ChainAccountType} accountType - The type of account you want to create.
 * @property signAlgorithm - The algorithm used to sign the transaction.
 */
type ContentProps = {
  signer: OfflineSigner;
  mnemonic: string | undefined;
};

const Content: FC<ContentProps> = ({signer, mnemonic}) => {
  const styles = useStyles();

  const [accountsByPage, setAccountsByPage] = useState<Array<ChainAccount[]>>(
    [],
  );
  const [profileCountByPage, setProfileCountByPage] = useState<
    Record<number, number>
  >({});
  const [selectedProfiles, setSelectedProfiles] = useState<ProfileData[]>([]);

  const {profiles: loadedProfiles, loading} = useLoadProfiles();

  const loadMoreAccounts = useCallback(() => {
    console.log(
      `loading profiles (${accountsByPage.length * PROFILE_PER_PAGE}-${
        (1 + accountsByPage.length) * PROFILE_PER_PAGE
      })...`,
    );
    if (accountsByPage.length >= MAX_PAGE_TO_LOAD) return; // Only load 10 pages
    generateAccounts(
      signer,
      mnemonic,
      accountsByPage,
      setAccountsByPage,
      setProfileCountByPage,
    );
  }, [signer, mnemonic, accountsByPage]);

  /* Reset and generate the first page of accounts */
  useEffect(() => {
    setAccountsByPage([]);
    setProfileCountByPage([]);
    loadMoreAccounts();
  }, [signer, mnemonic]);

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

  const loadedProfileAddresses = useMemo(
    () =>
      loadedProfiles.reduce(
        (set, profile) => set.add(profile.address),
        new Set<string>(),
      ),
    [loadedProfiles],
  );

  const accountsExcludedLoadedProfile = useMemo(() => {
    return accountsByPage
      .map((accounts, page) => ({
        accounts: accounts.filter(
          acc => !loadedProfileAddresses.has(acc.address),
        ),
        page,
      }))
      .filter(({accounts}) => accounts.length > 0);
  }, [accountsByPage, loadedProfileAddresses]);

  return (
    <View style={styles.content}>
      <ScrollView
        style={styles.scrollViewOuter}
        contentContainerStyle={styles.scrollViewInner}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            {accountsExcludedLoadedProfile.map(({accounts, page}) => (
              <ContentGroup
                page={page}
                accounts={accounts}
                selectedProfiles={selectedProfiles}
                handleSelect={handleSelect}
                setProfileCount={setProfileCount}
                loadMoreAccounts={loadMoreAccounts}
                key={page}
              />
            ))}
            {loadedProfiles.map(profile => (
              <AddProfileBadge
                value={profileToRadioValue(profile)}
                disabled={true}
                key={profile.address}
              />
            ))}
            {accountsByPage.length < MAX_PAGE_TO_LOAD && <ActivityIndicator />}
          </>
        )}
      </ScrollView>
      <Buttons
        canAddProfile={Object.values(profileCountByPage).some(
          count => count > 0,
        )}
        mnemonic={mnemonic}
        selectedProfiles={selectedProfiles}
        loadedProfileAddresses={loadedProfileAddresses}
      />
    </View>
  );
};

export default Content;
