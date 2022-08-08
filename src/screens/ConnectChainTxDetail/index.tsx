import React from 'react';
import LinkableChains from 'config/LinkableChains';
import {LinkableChain} from 'types/chains';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {connectIcon} from 'assets/images';
import Button from 'components/Button';
import useStyles from './useStyles';

const DUMMY_CHAIN = LinkableChains.find(
  x => x.name === 'Likecoin',
) as LinkableChain;

const ConnectChainTxDetail = () => {
  const {t} = useTranslation('connectChainTxDetail');

  const styles = useStyles();

  return (
    <DView scrollable style={styles.container} topBar={<TopBar />}>
      <Typography.H3>{t('header')}</Typography.H3>

      <View style={styles.chainImageGroup}>
        <Image source={DUMMY_CHAIN.icon} style={styles.chainIcon} />
        <Image source={connectIcon} style={styles.connectIcon} />
        <Image source={DUMMY_CHAIN.icon} style={styles.chainIcon} />
      </View>

      <Typography.Subtitle2 style={styles.textStyle}>
        {t('from')}
      </Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        desmos1x42esddfje95frgo53edbb5vep0
      </Typography.Body6>

      <Typography.Subtitle2 style={styles.textStyle}>
        {t('connectTo')}
      </Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        desmos1x42esddfje95frgo53edbb5vep0
      </Typography.Body6>

      <Typography.Subtitle2 style={styles.textStyle}>
        {t('fee')}
      </Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        0.001 DSM
      </Typography.Body6>

      <Typography.Subtitle2 style={styles.textStyle}>
        {t('note')}
      </Typography.Subtitle2>
      <Typography.Body6 style={[styles.textStyle, styles.valueStyle]}>
        {t('common:n/a')}
      </Typography.Body6>

      <View style={styles.buttonContainer}>
        <Button mode="gradientFilled">{t('common:next')}</Button>
      </View>
    </DView>
  );
};

export default ConnectChainTxDetail;
