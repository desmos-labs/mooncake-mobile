import React, { useCallback } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useFetchWallets } from 'screens/ImportAccountSelectProfile/components/AccountPicker/useHooks';
import { AccountWithWallet, SelectedAccount } from 'types/account';
import PaginatedFlatList, { ListRenderItemInfo } from 'components/PaginatedFlatList';
import ProfileItem from '../ProfileItem';
import useStyles from './useStyles';
import { AccountPickerParams } from './types';

export type AccountPickerProps = {
  /**
   * Callback called when the user select a wallet.
   * @param wallet
   */
  onAccountSelected: (wallet: SelectedAccount) => void;
  /**
   * Params that tells the component how to generate the addresses that are showed to the
   * user.
   */
  params: AccountPickerParams;
  style?: StyleProp<ViewStyle>;
};

const AccountPicker: React.FC<AccountPickerProps> = ({ onAccountSelected, params, style }) => {
  const styles = useStyles();
  const { fetchWallets } = useFetchWallets(params);

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<AccountWithWallet>) => {
      const { address } = info.item.account;
      return (
        <>
          <ProfileItem
            address={address}
            handlePress={profile => {
              onAccountSelected({
                ...info.item,
                profile,
              });
            }}
          />
          <View style={styles.separator} />
        </>
      );
    },
    [onAccountSelected, styles.separator],
  );

  const listKeyExtractor = useCallback((item: AccountWithWallet) => item.account.address, []);

  return (
    <View style={[style, styles.root]}>
      {/* Address picker */}
      <PaginatedFlatList
        contentContainerStyle={styles.contentContainer}
        loadPage={fetchWallets}
        itemsPerPage={10}
        renderItem={renderListItem}
        keyExtractor={listKeyExtractor}
        onEndReachedThreshold={0.1}
        estimatedItemSize={89}
      />
    </View>
  );
};

export default AccountPicker;
