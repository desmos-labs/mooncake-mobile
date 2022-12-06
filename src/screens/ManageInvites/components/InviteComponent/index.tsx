import Clipboard from '@react-native-clipboard/clipboard';
import {copyIcon, defaultProfilePic} from 'assets/images';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import React, {useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export interface Invite {
  code: number;
  link: string;
  claimer: ProfileData;
  creation_time: string;
  expiration_time: string;
  index: number;
}

const InviteComponent = ({
  code,
  link,
  claimer,
  creation_time,
  expiration_time,
  index,
}: Invite) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('invites');
  const creationDate = useFormatTimeForPostDetails(creation_time);
  const expirationDate = useFormatTimeForPostDetails(expiration_time);

  useEffect(() => {
    console.log('Invite number', index);
    console.log('Invite code', code);
    console.log('Creation date', creationDate);
    console.log('Expiration date', expirationDate);
  }, [creationDate, expirationDate]);

  const content = useMemo(() => {
    return (
      <View style={styles.flexRowView}>
        {claimer ? (
          <View style={{flexDirection: 'column', flex: 1}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Typography.Body5>
                {t('invite')} # {index}
              </Typography.Body5>
              <Typography.Body7 style={{color: theme.colors.midGrey}}>
                {creationDate}
              </Typography.Body7>
            </View>
            <Spacer paddingBottom={theme.spacing.s} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <FastImage
                style={styles.avatar}
                source={
                  claimer.profile_pic
                    ? {uri: claimer.profile_pic}
                    : defaultProfilePic
                }
              />
              <View style={styles.profileView}>
                <Typography.Subtitle2 numberOfLines={1}>
                  {claimer.nickname.trimStart() || 'no-nickname'}
                </Typography.Subtitle2>
                <Typography.Body7>
                  @{claimer.dtag.trimStart() || 'no-dtag'}
                </Typography.Body7>
              </View>
            </View>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Typography.Body5>
                {t('invite')} # {index}
              </Typography.Body5>
              <Typography.Body7 style={{color: theme.colors.midGrey}}>
                {creationDate}
              </Typography.Body7>
            </View>
            <Spacer paddingBottom={theme.spacing.s} />
            <View style={{flexDirection: 'row'}}>
              <Typography.Body7 style={{color: theme.colors.midGrey}}>
                {link}
              </Typography.Body7>
              <ImageButton
                buttonStyle={{alignSelf: 'center', marginLeft: 6}}
                image={copyIcon}
                style={{width: 16, height: 16}}
                onPress={() => Clipboard.setString(link)}
              />
            </View>
          </View>
        )}
      </View>
    );
  }, [link, claimer, creation_time, expiration_time, index]);

  return <View style={styles.container}>{content}</View>;
};

export default InviteComponent;
