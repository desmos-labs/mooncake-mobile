import {Coin} from '@cosmjs/stargate';
import {convertCoin} from '@desmoslabs/desmjs';
import appSettingsState from '@recoil/settings';
import {defaultProfilePic} from 'assets/images';
import React, {useEffect, useMemo} from 'react';
import {View, Image, ImageSourcePropType} from 'react-native';
import Typography from 'components/Typography';
import {useRecoilState} from 'recoil';
import useStyles from './useStyles';

type Props = {
  tipAmount: Coin;
  avatar?: ImageSourcePropType;
  address: string;
  nickname?: string;
  dTag?: string;
};

const TipItem = ({tipAmount, avatar, address, nickname, dTag}: Props) => {
  const [settings] = useRecoilState(appSettingsState);
  const styles = useStyles();

  const convertedAmount = useMemo(() => {
    return convertCoin(tipAmount, 6, settings.currentChain.denomUnits);
  }, [tipAmount, settings]);

  useEffect(() => {
    console.log(tipAmount);
    console.log(convertedAmount);
  }, [convertedAmount]);

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <Image source={avatar || defaultProfilePic} style={styles.avatarStyle} />

      <View style={styles.textGroup}>
        <Typography.Subtitle3 style={styles.textStyle} numberOfLines={1}>
          {nickname || address}
        </Typography.Subtitle3>
        <Typography.Body7 style={styles.subTextStyle}>
          @{dTag || 'no-dtag'}
        </Typography.Body7>
      </View>

      <Typography.Subtitle3 style={styles.textStyle}>
        {convertedAmount?.amount} {convertedAmount?.denom.toUpperCase()}
      </Typography.Subtitle3>
    </View>
  );
};

export default TipItem;
