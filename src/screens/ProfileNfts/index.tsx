import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import NftComponent from 'screens/ProfileNfts/components/NftComponent';
import GetNftsData from 'services/axios/requests/GetNftsData';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_NFTS>;

const ProfileNfts = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('nft');
  const [nfts, setNfts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchNfts = useCallback(async (address: string) => {
    setLoading(true);
    console.log('fetching');
    const newNfts = await GetNftsData(address);
    setNfts((existingNfts: any[]) => [...existingNfts, ...newNfts]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNfts('stars1p7k00hney7rx883qpp2gle0vv67sefnn8aun25');
  }, []);

  const handleNftPressed = useCallback((nftData: any) => {
    navigate(ROUTES.NFT_DETAILS, {
      nftData,
    });
  }, []);

  const renderNft = (nftData: any) => (
    <NftComponent
      data={nftData.item}
      onPress={() => handleNftPressed(nftData.item)}
    />
  );

  return (
    <DView
      backgroundColor={theme.colors.white}
      topBar={<TopBar style={{backgroundColor: theme.colors.white}} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}>
      <Spacer paddingVertical={10}>
        <Typography.H3>{t('nft')}</Typography.H3>
      </Spacer>
      <Typography.Body6>{t('link stars')}</Typography.Body6>
      <Spacer paddingVertical={10} />
      {nfts.length > 0 ? (
        <FlatList
          refreshing={loading}
          onRefresh={() =>
            fetchNfts('stars1p7k00hney7rx883qpp2gle0vv67sefnn8aun25')
          }
          showsVerticalScrollIndicator={false}
          data={nfts}
          windowSize={2}
          keyExtractor={item => item.tokenId}
          renderItem={renderNft}
          numColumns={2}
          style={{flex: 1, margin: -theme.spacing.m}}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={
            !loading ? (
              <EmptyPostComponent
                textLabel={t('noNft')}
                buttonLabel={t('connect address')}
              />
            ) : null
          }
        />
      ) : (
        <ActivityIndicator size="small" />
      )}
    </DView>
  );
};

export default ProfileNfts;
