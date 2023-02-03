import React, { useCallback, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useFetchWallets } from 'screens/SelectAccount/components/AccountPicker/useHooks';
import { AccountWithWallet } from 'types/account';
import PaginatedFlatList, { ListRenderItemInfo } from 'components/PaginatedFlatList';
import AccountListItem from '../ProfileItem';
import useStyles from './useStyles';
import { AccountPickerParams } from './types';

export type AccountPickerProps = {
  /**
   * Callback called when the user select a wallet.
   * @param wallet
   */
  onAccountSelected: (wallet: AccountWithWallet | null) => void;
  /**
   * Params that tells the component how to generate the addresses that are showed to the
   * user.
   */
  params: AccountPickerParams;
  style?: StyleProp<ViewStyle>;
};

const AccountPicker: React.FC<AccountPickerProps> = ({ onAccountSelected, params, style }) => {
  const styles = useStyles();
  const [selectedAccount, setSelectedAccount] = useState<AccountWithWallet | null>(null);
  const { fetchWallets } = useFetchWallets(params);

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<AccountWithWallet>) => {
      const { address } = info.item.account;
      return (
        <>
          <AccountListItem
            address={address}
            shouldFetchBalance={false}
            handlePress={() => {
              const account = selectedAccount?.account.address === address ? null : info.item;
              setSelectedAccount(account);
              onAccountSelected(account);
            }}
          />
          <View style={styles.separator} />
        </>
      );
    },
    [selectedAccount, onAccountSelected, setSelectedAccount],
  );

  const listKeyExtractor = useCallback((item: AccountWithWallet) => item.account.address, []);

  return (
    <View style={[style, styles.root]}>
      {/* Address picker */}
      <PaginatedFlatList
        extraData={selectedAccount}
        loadPage={fetchWallets}
        itemsPerPage={15}
        renderItem={renderListItem}
        keyExtractor={listKeyExtractor}
        onEndReachedThreshold={0.5}
        estimatedItemSize={89}
      />
    </View>
  );
};

export default AccountPicker;
