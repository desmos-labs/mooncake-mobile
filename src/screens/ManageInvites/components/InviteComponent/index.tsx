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
import { Box, HStack, useTheme, VStack } from 'native-base';
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
  const formatTime = useFormatTimeForPostDetails();
  const formattedDate = formatTime(invite.creationTime.toISOString());
  const content = useMemo(() => {
    return (
      <View style={styles.flexRowView}>
        {invite.claimerAddress ? (
          <VStack flex={1}>
            <HStack justifyContent="space-between">
              <Typography.Body5>
                {t('invite')} # {index}
              </Typography.Body5>
              <Typography.Body7 style={{ color: theme.colors.midGrey }}>
                {formattedDate}
              </Typography.Body7>
            </HStack>
            <Spacer paddingBottom={theme.spacing.s} />
            <HStack alignItems="center">
              <FastImage style={styles.avatar} source={getProfilePicture(invite.claimer)} />
              <View style={styles.profileView}>
                {invite.claimer ? (
                  <>
                    <Typography.Subtitle2 numberOfLines={1}>
                      {invite.claimer?.nickname?.trimStart() || 'no-nickname'}
                    </Typography.Subtitle2>
                    <Typography.Body7>
                      @{invite.claimer?.dTag?.trimStart() || 'no-dtag'}
                    </Typography.Body7>
                  </>
                ) : (
                  <Typography.Subtitle3 numberOfLines={1} style={styles.maxWidth70}>
                    {invite.claimerAddress}
                  </Typography.Subtitle3>
                )}
              </View>
            </HStack>
          </VStack>
        ) : (
          <Box flex={1}>
            <HStack justifyContent="space-between">
              <Typography.Body5>
                {t('invite')} # {index}
              </Typography.Body5>
              <Typography.Body7 style={{ color: theme.colors.midGrey }}>
                {formattedDate}
              </Typography.Body7>
            </HStack>
            <Spacer paddingBottom={theme.spacing.s} />
            <View>
              <HStack>
                <Typography.Body7 style={{ color: theme.colors.midGrey }}>
                  {invite.link}
                </Typography.Body7>
                <ImageButton
                  buttonStyle={styles.buttonStyle}
                  image={copyIcon}
                  style={styles.buttonImage}
                  onPress={() => Clipboard.setString(invite.link)}
                />
              </HStack>
              <Spacer paddingTop={theme.spacing.s} />
              <HStack>
                <Typography.Body7 style={{ color: theme.colors.midGrey }}>
                  {invite.code}
                </Typography.Body7>
                <ImageButton
                  buttonStyle={styles.buttonStyle}
                  image={copyIcon}
                  style={styles.buttonImage}
                  onPress={() => Clipboard.setString(invite.code)}
                />
              </HStack>
            </View>
          </Box>
        )}
      </View>
    );
  }, [formattedDate, index, invite.claimer, invite.claimerAddress, invite.code, invite.link]);

  return <View style={styles.container}>{content}</View>;
};

export default InviteComponent;
