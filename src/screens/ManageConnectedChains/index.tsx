import Button from 'components/Button';
import DView from 'components/DView';
import GradientBorder from 'components/GradientBorder';
import Typography from 'components/Typography';
import useChainLinks from 'hooks/useChainLinks';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {Snackbar} from 'react-native-paper';
import ChainLinkItem from 'screens/ManageConnectedChains/components/ChainLinkItem';
import NoConnections from 'screens/ManageConnectedChains/components/NoConnections';
import {ChainLink} from 'types/link';
import useStyles from './useStyles';

const ManageConnectedChains = () => {
  const {t} = useTranslation('manageChains');

  const styles = useStyles();

  // TODO: replace with user's address, or any address for testing
  const chainLinks = useChainLinks(
    'desmos1rqpjh38ssmu5wqxqvelttmg9wv4mupkxvr3je4',
  );
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

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <View>
        <NoConnections />

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {}}
            mode="gradientFilled"
            labelStyle={styles.buttonStyle}>
            {t('profile:connectAddress')}
          </Button>
        </View>
      </View>
    );
  }, []);

  // This screen usings a combination of GradientBorder and zIndexWrapper to create
  // a pleasant scrolling experience while on ios. Without it, the dropshadow would
  // appear cut off during overscroll
  return (
    <DView>
      <View style={styles.zIndexWrapper}>
        <View style={styles.textContainer}>
          <Typography.H3>{t('connectedAddresses')}</Typography.H3>

          <Typography.Body6 style={styles.descriptionText}>
            {t('description')}
          </Typography.Body6>
        </View>

        <GradientBorder height={15} />
      </View>

      <FlatList
        data={chainLinks}
        renderItem={renderChainLinks}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.flatListContainer}
        style={{overflow: 'visible'}}
      />

      <Snackbar
        visible={showSnackbar}
        style={styles.snackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: t('hide'),
        }}
        duration={Snackbar.DURATION_SHORT}>
        <Typography.Caption1>{t('common:addressCopied')}</Typography.Caption1>
      </Snackbar>
    </DView>
  );
};

export default ManageConnectedChains;
