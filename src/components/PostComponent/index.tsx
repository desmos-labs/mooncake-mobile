import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

// TODO: refactor this component to handle images and text + image shareable between home and post details

type Props = {
  /**
   * The data of the post retrieved from a query.
   */
  postData: PostItem;
};

const PostComponent = ({postData}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {attachments} = postData;

  const {MediaAttachment} = useRenderMediaAttachment({
    attachments,
    useAutoSize: true,
  });

  const content = React.useMemo(() => {
    if (postData?.text && postData?.attachments?.length === 0) {
      return (
        <View style={styles.textContainer}>
          <Typography.H2 style={styles.textStyle}>
            {postData.text}
          </Typography.H2>
        </View>
      );
    } else if (!postData?.text && postData?.attachments?.length > 0) {
      return <View style={{flex: 1}}>{MediaAttachment}</View>;
    } else {
      return (
        <View>
          {MediaAttachment}
          <Typography.Body7 style={{margin: theme.spacing.m}}>
            {postData.text}
          </Typography.Body7>
        </View>
      );
    }
  }, [postData, MediaAttachment]);

  return (
    <View onStartShouldSetResponder={() => true} style={styles.container}>
      {content}
    </View>
  );
};

export default PostComponent;
