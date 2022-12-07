import {verifiedIcon} from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import GetAppIcon from 'lib/GetAppIcon';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, TouchableOpacity, View} from 'react-native';
import useStyles from './useStyles';

type Props = {
  /**
   * The name of the app. Component will map the icon or show a desmos icon
   * if a matching image cannot be found.
   */
  appName: string;

  /**
   * The username related to that connected app.
   */
  username: string;

  /**
   * What to do when the user presses the Disconnect button.
   */
  onPressDisconnect: () => void;
  state: string;
};

const AppConnectedItem = ({
  appName,
  username,
  onPressDisconnect,
  state,
}: Props) => {
  const {t} = useTranslation('common');
  const styles = useStyles();

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <DropShadowWrapper
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.05)',
        offset: [10, 20],
        radius: 40,
        distance: 40,
      }}
      innerShadowProps={{
        startColor: 'rgba(16, 24, 40, 0.05)',
        offset: [0, 1],
        radius: 10,
        distance: 10,
      }}>
      <View style={styles.container}>
        <Image style={styles.icon} source={GetAppIcon(appName)} />

        <View style={styles.centerGroup}>
          <View style={{flexDirection: 'row'}}>
            <Typography.H5 style={styles.baseText}>{username}</Typography.H5>
            {state === 'APPLICATION_LINK_STATE_VERIFICATION_SUCCESS' ? (
              <Image
                source={verifiedIcon}
                style={{
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginLeft: 4,
                }}
              />
            ) : (
              <Image
                source={verifiedIcon}
                style={{
                  tintColor: 'rgba(221, 221, 221, 1)',
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                  marginLeft: 4,
                }}
              />
            )}
          </View>

          <View style={styles.addressGroup}>
            <Typography.Body7
              style={styles.baseText}
              numberOfLines={1}
              ellipsizeMode="middle">
              @{appName}
            </Typography.Body7>
          </View>
        </View>

        <View style={styles.disconnectButton}>
          <TouchableOpacity onPress={onPressDisconnect}>
            <Typography.Subtitle4 style={styles.disconnectText}>
              {t('disconnect')}
            </Typography.Subtitle4>
          </TouchableOpacity>
        </View>
      </View>
    </DropShadowWrapper>
  );
};

export default AppConnectedItem;
