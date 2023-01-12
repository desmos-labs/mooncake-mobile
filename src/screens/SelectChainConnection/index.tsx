import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {selectedChainState} from '@recoil/connectChainState';
import DView from 'components/DView';
import SearchBar from 'components/SearchBar';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {getDenomSymbol} from 'config/ChainAssets';
import LinkableChains from 'config/LinkableChains';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import ChainItem from 'screens/SelectChainConnection/components/ChainItem';
import {ChainAsset, LinkableChain} from 'types/chains';

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

  const denomSymbols: {[index: string]: ChainAsset} = React.useMemo(() => {
    return LinkableChains.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.name]: getDenomSymbol(cur.name),
      };
    }, {});
  }, [LinkableChains]);

  const listItems = React.useMemo(() => {
    const sortedItems = LinkableChains.sort((a, b) => {
      const aSymbol = denomSymbols[a.name].symbol;
      const bSymbol = denomSymbols[b.name].symbol;
      // DSM will always be the first result
      if (aSymbol === 'DSM' || bSymbol === 'DSM') return 1;
      if (aSymbol > bSymbol) return 1;
      if (aSymbol < bSymbol) return -1;
      return 0;
    });

    return sortedItems.filter(chain => {
      const {symbol} = denomSymbols[chain.name];

      const lowercaseFilter = filter.toLowerCase();

      return (
        symbol.toLowerCase().includes(lowercaseFilter) ||
        chain.name.toLowerCase().includes(lowercaseFilter)
      );
    });
  }, [filter]);

  const renderItem = React.useCallback(
    ({item, index}: ListRenderItemInfo<LinkableChain>) => {
      if (index === 0) {
        return (
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: theme.spacing.m,
              marginHorizontal: -theme.spacing.m,
              paddingBottom: theme.spacing.m,
            }}>
            <SearchBar
              handleChange={setFilter}
              searchPlaceHolder={t('searchPlaceholder')}
            />
          </View>
        );
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
    <DView topBar={<TopBar />} backgroundColor={theme.colors.white}>
      <FlatList
        // create a dummy first index item, so that the renderItem functions
        // can render the search bar without replacing the first item of the list
        data={[0 as any, ...listItems]}
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

export default SelectChainConnection;
