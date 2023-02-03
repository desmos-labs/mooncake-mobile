import { defaultProfilePic } from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import { clearTimeout } from '@testing-library/react-native/build/helpers/timers';
import useStyles from './useStyles';

type Props = {
  address: string;
  /**
   * Tells if we should fetch the balance of the provided address.
   */
  shouldFetchBalance: boolean;
  /**
   * What to do when the ProfileItem is pressed.
   */
  handlePress: () => void;
};
const Image = createImageProgress(FastImage);

const ProfileItem = ({ address, handlePress, shouldFetchBalance }: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('selectDtag');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      // TODO: Fetch profile and balance.
      console.log('Implement fetch data', address);
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [address]);

  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.07)',
        distance: 40,
        offset: [10, 20],
      }}>
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Image
          resizeMode="cover"
          source={defaultProfilePic}
          imageStyle={{ borderRadius: 23 }}
          style={styles.avatar}
        />
        <View>
          <Typography.H5>{t('noNickname')}</Typography.H5>

          <Typography.Body6>{address}</Typography.Body6>
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default ProfileItem;
