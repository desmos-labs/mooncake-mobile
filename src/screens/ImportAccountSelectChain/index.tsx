import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import SearchBar from 'components/SearchBar';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import LinkableChains, { DesmosChain } from 'config/LinkableChains';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { useTheme } from 'native-base';
import ChainItem from 'screens/ImportAccountSelectChain/components/ChainItem';
import { SupportedChain } from 'types/chains';
import {
  useImportAccountState,
  useSetImportAccountState,
} from '@recoil/screens/importAccountState';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN>;

const ImportAccountSelectChain = () => {
  const { t } = useTranslation('selectChain');
  const { navigate } = useNavigation<NavProps['navigation']>();
  const theme = useTheme();
  const [filter, setFilter] = useState('');
  const { onCancel } = useImportAccountState()!;
  const setImportAccountState = useSetImportAccountState();
  const styles = useStyles();
  useOnBackAction(onCancel, []);

  const handlePressChainItem = React.useCallback(
    (chain: SupportedChain) => () => {
      setImportAccountState(importAccountState => ({
        ...importAccountState!,
        selectedChain: chain,
      }));
      navigate(ROUTES.IMPORT_ACCOUNT_SELECT_MODE);
    },
    [navigate, setImportAccountState],
  );

  const sortedChains = React.useMemo(() => {
    return [...LinkableChains].sort((a, b) => {
      // Desmos will always be the first result
      if (a.name === DesmosChain.name) return 1;
      if (b.name === DesmosChain.name) return -1;

      // Sorting function.
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
  }, []);

  const listItems = React.useMemo(() => {
    if (filter.length === 0) {
      return [0 as any, ...sortedChains];
    }

    return [
      0 as any,
      ...sortedChains.filter(chain => {
        const lowercaseFilter = filter.toLowerCase();
        const lowercaseChainName = chain.name.toLowerCase();
        return lowercaseChainName.includes(lowercaseFilter);
      }),
    ];
  }, [filter, sortedChains]);

  const renderItem = React.useCallback(
    ({ item, index }: ListRenderItemInfo<SupportedChain>) => {
      if (index === 0) {
        return (
          <View style={styles.renderItem}>
            <SearchBar handleChange={setFilter} searchPlaceHolder={t('searchPlaceholder')} />
          </View>
        );
      }
      return <ChainItem chain={item} handlePress={handlePressChainItem(item)} />;
    },
    [handlePressChainItem, styles.renderItem, t],
  );

  const ItemSeparatorComponent = React.useCallback(() => {
    return <Spacer paddingVertical={theme.spacing.s} />;
  }, [theme.spacing.s]);

  return (
    <DView topBar={<TopBar />} backgroundColor={theme.colors.white}>
      <FlatList
        // create a dummy first index item, so that the renderItem functions
        // can render the search bar without replacing the first item of the list
        data={listItems}
        renderItem={renderItem}
        ListHeaderComponent={
          <Spacer paddingBottom={theme.spacing.m}>
            <Typography.H3>{t('header')}</Typography.H3>
            <Spacer paddingVertical={theme.spacing.s} />
            <Typography.Body6>{t('selectChain')}</Typography.Body6>
          </Spacer>
        }
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.m,
        }}
        ItemSeparatorComponent={ItemSeparatorComponent}
        stickyHeaderIndices={[1]}
      />
    </DView>
  );
};

export default ImportAccountSelectChain;
