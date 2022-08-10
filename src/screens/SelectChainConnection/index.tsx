import React, {useState} from 'react';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo} from 'react-native';
import LinkableChains from 'config/LinkableChains';
import {LinkableChain} from 'types/chains';
import ChainItem from 'screens/SelectChainConnection/components/ChainItem';
import {getDenomSymbol} from 'config/ChainAssets';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import SearchBar from 'screens/SelectChainConnection/components/SearchBar';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {useSetRecoilState} from 'recoil';
import {selectedChainState} from '@recoil/connectChainState';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_CHAIN>;

const SelectChainConnection = () => {
  const {t} = useTranslation('selectChain');

  const {navigate} = useNavigation<NavProps['navigation']>();

  const setSelectedChain = useSetRecoilState(selectedChainState);

  const theme = useTheme();

  const [filter, setFilter] = useState('');

  const handlePressChainItem = React.useCallback(
    (chain: LinkableChain) => () => {
      setSelectedChain(chain);
      navigate(ROUTES.CONNECT_CHAIN_METHOD);
    },
    [],
  );

  const listItems = React.useMemo(() => {
    const sortedItems = LinkableChains.sort((a, b) => {
      const aSymbol = getDenomSymbol(a.name).symbol;
      const bSymbol = getDenomSymbol(b.name).symbol;
      // DSM will always be the first result
      if (aSymbol === 'DSM' || bSymbol === 'DSM') return 1;
      if (aSymbol > bSymbol) return 1;
      if (aSymbol < bSymbol) return -1;
      return 0;
    });

    const filteredItems = sortedItems.filter(chain => {
      const {symbol} = getDenomSymbol(chain.name);

      const lowercaseFilter = filter.toLowerCase();

      return (
        symbol.toLowerCase().includes(lowercaseFilter) ||
        chain.name.toLowerCase().includes(lowercaseFilter)
      );
    });

    return filteredItems;
  }, [filter]);

  const renderItem = React.useCallback(
    ({item, index}: ListRenderItemInfo<LinkableChain>) => {
      if (index === 0) {
        return <SearchBar handleChange={setFilter} />;
      }
      return (
        <ChainItem
          chainName={item.name}
          symbol={getDenomSymbol(item.name).symbol}
          icon={item.icon}
          handlePress={handlePressChainItem(item)}
        />
      );
    },
    [],
  );

  const ItemSeparatorComponent = React.useCallback(() => {
    return <Spacer paddingVertical={theme.spacing.s} />;
  }, []);

  return (
    <DView topBar={<TopBar />}>
      <FlatList
        // create a dummy first index item, so that the renderItem functions
        // can render the search bar without replacing the first item of the list
        data={[0 as any, ...listItems]}
        renderItem={renderItem}
        ListHeaderComponent={
          <Spacer paddingBottom={16}>
            <Typography.H3>{t('header')}</Typography.H3>
            <Typography.Body6>{t('selectChain')}</Typography.Body6>
          </Spacer>
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
        }}
        ItemSeparatorComponent={ItemSeparatorComponent}
        stickyHeaderIndices={[1]}
      />
    </DView>
  );
};

export default SelectChainConnection;
