import Button from 'components/Button';
import Typography from 'components/Typography';

import ToastConfig from 'config/ToastConfig';
import React from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Shadow} from 'react-native-shadow-2';
import {useTranslation} from 'react-i18next';
import useStyles from './useStyles';

export interface Props {
  type: ToastConfig;
  toast: any;
}

const CustomToast = ({type, toast}: Props): JSX.Element => {
  const styles = useStyles({type, toast});
  const theme = useTheme();
  const {t} = useTranslation('');

  const handlePress = React.useCallback(() => {
    if (type === ToastConfig.SUCCESS) {
      toast.onPress();
    } else {
      Alert.alert('Error details', toast.message);
    }
  }, [toast.message]);

  return (
    <Shadow
      startColor="rgba(133, 133, 133, 0.06)"
      distance={12}
      offset={[0, 10]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handlePress}
        style={styles.commonToastStyle}>
        <View style={{flex: 1}}>
          {type !== ToastConfig.SUCCESS && (
            <Typography.Subtitle3>{t('common:oops')}</Typography.Subtitle3>
          )}
          <Typography.Body6
            numberOfLines={2}
            style={{color: theme.colors.surfaceBlack}}>
            {toast.message}
          </Typography.Body6>
        </View>

        {type === ToastConfig.ERROR ? (
          <Button
            style={styles.button}
            mode="text"
            onPress={toast.onPressRetry}>
            <Typography.Subtitle3>Retry</Typography.Subtitle3>
          </Button>
        ) : null}
      </TouchableOpacity>
    </Shadow>
  );
};

export default CustomToast;
