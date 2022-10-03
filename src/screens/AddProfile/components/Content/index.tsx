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
import isLedgerSigner from 'screens/AddProfile/isLedgerSigner';
import generateLedgerAccounts from 'screens/AddProfile/generateLedgerAccounts';
import generateLocalAccounts from 'screens/AddProfile/generateLocalAccounts';
import AddProfileBadgeGroup from '../AddProfileBadgeGroup';
import useStyles from './useStyles';
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
 * @property {ChainAccount[] | undefined;} accounts - ChainAccount[] - The list of accounts that are currently
 * loaded.
 * @property {ProfileData[]} selectedProfiles - The profiles that are currently selected.
 * @property handleSelect - This is a function that is called when a profile is selected.
 * @property setProfileCount - This is a function that sets the profile count for a given page.
 * @property loadMoreAccounts - This is a function that will be called when the user clicks the "Load
 * More" button.
 */
type ContentGroupProps = {
  page: number;
  accounts: ChainAccount[] | undefined;
  selectedProfileMap: Map<string, ProfileData>;
  handleSelect: (profile: ProfileData) => void;
  setProfileCount: (page: number, count: number) => void;
  loadMoreAccounts: () => void;
};

/* A React component that is used to render a group of AddProfileBadge components. */
const ContentGroup: FC<ContentGroupProps> = ({
  page,
  accounts,
  selectedProfileMap,
  handleSelect,
  setProfileCount,
  loadMoreAccounts,
}) => {
  const addresses = useMemo(
    () => accounts?.map(account => account.address) ?? [],
    [accounts],
  );
  if (!addresses.length) return null;
  return (
    <Suspense fallback={<ActivityIndicator />} key={page}>
      {accounts ? (
        <AddProfileBadgeGroup
          page={page}
          addresses={addresses}
          selectedProfileMap={selectedProfileMap}
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
        (1 + accountsByPage.length) * PROFILE_PER_PAGE - 1
      })...`,
    );
    if (accountsByPage.length >= MAX_PAGE_TO_LOAD) return; // Only load 10 pages
    (async () => {
      const page = accountsByPage.length; // zero-based page number
      const newAccounts = await generateAccounts(page, signer, mnemonic);
      setAccountsByPage(prev => {
        const result = prev.slice();
        if (result.length < page) {
          result.length = page;
          result.fill([], prev.length);
        }
        result.splice(page, 1, newAccounts);
        return result;
      });
      setProfileCountByPage(prev => ({...prev, [page]: 0}));
    })();
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

  /* Creating a map of the selected profiles. */
  const selectedProfileMap = useMemo(
    () => new Map(selectedProfiles.map(profile => [profile.address, profile])),
    [selectedProfiles],
  );

  const loadedProfileMap = useMemo(
    () => new Map(loadedProfiles.map(profile => [profile.address, profile])),
    [loadedProfiles],
  );

  const accountsExcludedLoadedProfile = useMemo(() => {
    return accountsByPage
      .map((accounts, page) => ({
        accounts: accounts.filter(acc => !loadedProfileMap.has(acc.address)),
        page,
      }))
      .filter(({accounts}) => accounts.length > 0);
  }, [accountsByPage, loadedProfileMap]);

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
                selectedProfileMap={selectedProfileMap}
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
        selectedProfileMap={selectedProfileMap}
        loadedProfileMap={loadedProfileMap}
        accountsByPage={accountsByPage}
      />
    </View>
  );
};

/**
 * It generates a list of accounts based on the page number, the signer, and the mnemonic
 * @param {number} page - The page number of the accounts to generate.
 * @param {OfflineSigner} signer - OfflineSigner - this is the signer that the user has selected.
 * @param {string | undefined} mnemonic - The mnemonic phrase used to generate the accounts.
 * @returns An array of accounts
 */
function generateAccounts(
  page: number,
  signer: OfflineSigner,
  mnemonic: string | undefined,
) {
  const addressIndexOffset = page * PROFILE_PER_PAGE;
  if (isLedgerSigner(signer)) {
    return generateLedgerAccounts(addressIndexOffset, PROFILE_PER_PAGE, signer);
  }
  return generateLocalAccounts(addressIndexOffset, PROFILE_PER_PAGE, mnemonic);
}

export default Content;
