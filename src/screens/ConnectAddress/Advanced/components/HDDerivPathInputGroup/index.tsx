import React from 'react';
import {TextInput, View} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import Typography from 'components/Typography';
import {makeStyle} from 'config/theme';
import {useTranslation} from 'react-i18next';

type Props = {
  coin: number;

  values: {[index: string]: any};

  handleChangeAccount: (value: string) => void;

  handleChangeChange: (value: string) => void;

  handleChangeAddress: (Value: string) => void;
};

const HDDerivPathInputGroup = ({
  coin,
  values,
  handleChangeAccount,
  handleChangeAddress,
  handleChangeChange,
}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation('connectAddress');

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}>
      <View style={{width: scale(30)}}>
        <Typography.Caption2 style={{opacity: 0}}>a</Typography.Caption2>
        <Typography.Body5
          style={[styles.textBottomElement, styles.textAdjustment]}>
          m/
        </Typography.Body5>
      </View>

      <View style={{width: scale(41)}}>
        <Typography.Caption2>{t('purpose')}</Typography.Caption2>
        <Typography.Body5
          style={[styles.textBottomElement, styles.textAdjustment]}>
          44&apos;/
        </Typography.Body5>
      </View>

      <View style={{width: scale(41)}}>
        <Typography.Caption2>{t('coin')}</Typography.Caption2>
        <Typography.Body5
          style={[styles.textBottomElement, styles.textAdjustment]}>
          {coin}&apos;/
        </Typography.Body5>
      </View>

      <View style={{width: scale(50)}}>
        <Typography.Caption2>{t('account')}</Typography.Caption2>
        <TextInput
          style={[styles.textInput, styles.textBottomElement]}
          value={`${values.account}`}
          onChangeText={handleChangeAccount}
          keyboardType="numeric"
        />
      </View>

      <View
        style={{
          marginHorizontal: 4,
          width: scale(10),
        }}>
        <Typography.Caption2 style={{opacity: 0}}>a</Typography.Caption2>
        <Typography.Body5
          style={[styles.textBottomElement, styles.textAdjustment]}>
          &apos;/
        </Typography.Body5>
      </View>

      <View style={{width: scale(41)}}>
        <Typography.Caption2>{t('change')}</Typography.Caption2>
        <TextInput
          style={[styles.textInput, styles.textBottomElement]}
          value={`${values.change}`}
          onChangeText={handleChangeChange}
          keyboardType="numeric"
        />
      </View>

      <View
        style={{
          marginHorizontal: 4,
          width: scale(10),
        }}>
        <Typography.Caption2 style={{opacity: 0}}>a</Typography.Caption2>
        <Typography.Body5
          style={[styles.textBottomElement, styles.textAdjustment]}>
          &apos;/
        </Typography.Body5>
      </View>

      <View style={{width: scale(41)}}>
        <Typography.Caption2>{t('address')}</Typography.Caption2>
        <TextInput
          style={[styles.textInput, styles.textBottomElement]}
          value={`${values.addressIndex}`}
          onChangeText={handleChangeAddress}
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

const useStyles = makeStyle(theme => ({
  textInput: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    textAlign: 'center',
  },
  textAdjustment: {
    marginTop: 4,
  },
  textBottomElement: {
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    height: verticalScale(30),
  },
  textInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default HDDerivPathInputGroup;
