import Clipboard from '@react-native-clipboard/clipboard';
import { copyIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { getProfilePicture } from 'lib/ProfileUtils';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'native-base';
import { Invite } from 'types/invites';
import useStyles from './useStyles';

export interface InviteComponentProps {
  readonly invite: Invite;
  readonly index: number;
}

const InviteComponent: React.FC<InviteComponentProps> = ({ index, invite }) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('invites');
  const creationDate = useFormatTimeForPostDetails(invite.creationTime.toISOString());

  const content = useMemo(() => {
    return (
      <View style={styles.flexRowView}>
        {invite.claimer ? (
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography.Body5>
                {t('invite')} # {index}
              </Typography.Body5>
              <Typography.Body7 style={{ color: theme.colors.midGrey }}>
                {creationDate}
              </Typography.Body7>
            </View>
            <Spacer paddingBottom={theme.spacing.s} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <FastImage style={styles.avatar} source={getProfilePicture(invite.claimer)} />
              <View style={styles.profileView}>
                <Typography.Subtitle2 numberOfLines={1}>
                  {invite.claimer?.nickname?.trimStart() || 'no-nickname'}
                </Typography.Subtitle2>
                <Typography.Body7>
                  @{invite.claimer?.dTag?.trimStart() || 'no-dtag'}
                </Typography.Body7>
              </View>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography.Body5>
                {t('invite')} # {index}
              </Typography.Body5>
              <Typography.Body7 style={{ color: theme.colors.midGrey }}>
                {creationDate}
              </Typography.Body7>
            </View>
            <Spacer paddingBottom={theme.spacing.s} />
            <View style={{ flexDirection: 'row' }}>
              <Typography.Body7 style={{ color: theme.colors.midGrey }}>
                {invite.link}
              </Typography.Body7>
              <ImageButton
                buttonStyle={{ alignSelf: 'center', marginLeft: 6 }}
                image={copyIcon}
                style={{ width: 16, height: 16 }}
                onPress={() => Clipboard.setString(invite.link)}
              />
            </View>
          </View>
        )}
      </View>
    );
  }, [
    creationDate,
    index,
    invite.claimer,
    invite.link,
    styles.avatar,
    styles.flexRowView,
    styles.profileView,
    t,
    theme.colors.midGrey,
    theme.spacing.s,
  ]);

  return <View style={styles.container}>{content}</View>;
};

export default InviteComponent;
