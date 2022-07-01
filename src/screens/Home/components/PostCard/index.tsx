import React from 'react';
import {Post} from '@desmoslabs/desmjs-types/desmos/posts/v1beta1/posts';
import {TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
import ProfileHeaderButton from 'screens/Home/components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import {blogDetails, followIcon} from 'assets/images';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

interface PostType extends Post {
  text: string;
}

type Props = {
  PostData: PostType;

  onPressAuthor: () => void;

  onPressFollow: () => void;

  onPressDetails: () => void;
};

// The post dimensions are controlled by the Carousel
const PostCard = ({
  PostData,
  onPressAuthor,
  onPressFollow,
  onPressDetails,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  // author data is hardcoded until data flow is finalized
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Typography.H2 style={styles.textStyle}>{PostData.text}</Typography.H2>
      </View>
      <View style={styles.bottomGroup}>
        <TouchableOpacity onPress={onPressAuthor} style={styles.profileGroup}>
          <ProfileHeaderButton
            imageSrc={{uri: 'https://i.imgur.com/aih9snA.png'}}
            onPress={onPressAuthor}
          />
          <Spacer paddingLeft={theme.spacing.m}>
            <Typography.Subtitle2 style={styles.profileText}>
              Shrek
            </Typography.Subtitle2>
            <Typography.Body6 style={styles.profileText}>
              @SwampyBoi
            </Typography.Body6>
          </Spacer>
        </TouchableOpacity>

        <View>
          <ProfileHeaderButton imageSrc={followIcon} onPress={onPressFollow} />

          <Spacer paddingTop={theme.spacing.m}>
            <ProfileHeaderButton
              imageSrc={blogDetails}
              onPress={onPressDetails}
            />
          </Spacer>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
