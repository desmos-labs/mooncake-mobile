import Typography from 'components/Typography';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

export interface Invite {
  code: number;
  link: string;
  claimer: ProfileData;
  creation_time: string;
  expiration_time: string;
}

const InviteComponent = ({
  code,
  link,
  claimer,
  creation_time,
  expiration_time,
}: Invite) => {
  /*  const {t} = useTranslation('activities');
  const theme = useTheme(); */
  const styles = useStyles();
  const creationDate = useFormatTimeForPostDetails(creation_time);
  const expirationDate = useFormatTimeForPostDetails(expiration_time);

  useEffect(() => {
    console.log(code);
    console.log(link);
    console.log(creationDate);
    console.log(expirationDate);
  }, []);

  const content = useMemo(() => {
    return (
      <View style={styles.flexRowView}>
        <FastImage style={styles.avatar} source={{uri: claimer.profile_pic}} />
        <View style={styles.profileView}>
          <Typography.Subtitle3>
            {claimer.nickname.trimStart()}
            <Typography.Body6>test</Typography.Body6>
          </Typography.Subtitle3>
        </View>
      </View>
    );
  }, []);

  return <View style={styles.container}>{content}</View>;
};

export default InviteComponent;
