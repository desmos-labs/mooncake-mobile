import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import NftComponent from 'screens/ProfileNfts/components/NftComponent';
import nftTestData from 'screens/ProfileNfts/mock';
import useStyles from './useStyles';

// type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_NFTS>;

const ProfileNfts = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('nft');

  const handleNftPressed = useCallback((item: any) => {
    console.log('pressed', item);
  }, []);

  const renderNft = (data: any) => (
    <NftComponent
      data={data.item}
      onPress={() => handleNftPressed(data.item)}
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
      <FlatList
        showsVerticalScrollIndicator={false}
        data={nftTestData}
        keyExtractor={item => item.tokenId}
        renderItem={renderNft}
        numColumns={2}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          <EmptyPostComponent
            textLabel={t('noNft')}
            buttonLabel={t('connect address')}
          />
        }
      />
    </DView>
  );
};

export default ProfileNfts;
