import {twitterIcon} from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const TweetComponent = ({
  selected,
  data,
  user,
  onPress,
}: {
  selected: boolean;
  data: any;
  user: any;
  onPress: (id: number) => void;
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const formattedDate = useFormatTimeForPostDetails(data.creation_date);

  return (
    <DropShadowWrapper
      style={styles.container}
      outerShadowProps={{startColor: 'rgba(16, 24, 40, 0.03)', distance: 30}}>
      <TouchableOpacity
        onPress={() => onPress(data.id)}
        style={[
          {
            padding: theme.spacing.m,
            borderRadius: theme.roundness,
            backgroundColor: theme.colors.white,
          },
          selected && {backgroundColor: theme.colors.butterOrange05},
        ]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={{uri: user.profile_pic}} style={styles.profilePic} />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              marginLeft: theme.spacing.s,
            }}>
            <Typography.Subtitle3>{user?.name}</Typography.Subtitle3>
            <Typography.Body7>@{user?.username}</Typography.Body7>
          </View>
          <Image source={twitterIcon} style={styles.image} />
        </View>
        <Spacer paddingBottom={theme.spacing.m} />
        <Typography.Body6>{data.text}</Typography.Body6>
        <Spacer paddingVertical={theme.spacing.s} />
        <Typography.Caption3 style={{color: theme.colors.grey02}}>
          {formattedDate}
        </Typography.Caption3>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default TweetComponent;
