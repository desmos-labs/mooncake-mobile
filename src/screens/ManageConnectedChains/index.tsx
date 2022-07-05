import React from 'react';
import useChainLinks from 'hooks/useChainLinks';
import {View, FlatList, ListRenderItemInfo} from 'react-native';
import {Snackbar} from 'react-native-paper';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {ChainLink} from 'types/link';
import ChainLinkItem from 'screens/ManageConnectedChains/components/ChainLinkItem';
import FlatListSeparator from 'components/FlatListSeparator';
import useStyles from './useStyles';

const ManageConnectedChains = () => {
  const {t} = useTranslation('manageChains');

  const styles = useStyles();

  // TODO: replace with user's address, or any address for testing
  const chainLinks = useChainLinks('');
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const renderChainLinks = React.useCallback(
    (info: ListRenderItemInfo<ChainLink>) => {
      return (
        <ChainLinkItem
          chainName={info.item.chainName}
          address={info.item.externalAddress}
          onPressDisconnect={() => {
            // TODO: implementation
          }}
          showSnackBar={() => setShowSnackbar(true)}
        />
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typography.H3>{t('connectedAddresses')}</Typography.H3>

        <Typography.Body style={styles.descriptionText}>
          {t('description')}
        </Typography.Body>
      </View>

      <FlatList
        data={chainLinks}
        renderItem={renderChainLinks}
        ItemSeparatorComponent={FlatListSeparator}
        contentContainerStyle={styles.flatListContainer}
      />

      <Snackbar
        visible={showSnackbar}
        style={styles.snackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: t('hide'),
        }}
        duration={Snackbar.DURATION_SHORT}>
        <Typography.Body>{t('addressCopied')}</Typography.Body>
      </Snackbar>
    </View>
  );
};

export default ManageConnectedChains;
