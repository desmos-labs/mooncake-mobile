import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Hyperlink } from 'react-native-hyperlink';
import useStyles from './useStyles';

interface PostTextProps {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Component that allows to display the text of a post.
 * @constructor
 */
const PostText = (props: PostTextProps) => {
  const styles = useStyles();
  const { children, style } = props;

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    children && (
      <Hyperlink style={style} linkDefault={true} linkStyle={styles.link}>
        <Typography.Regular16>{children}</Typography.Regular16>
      </Hyperlink>
    )
  );
};

export default PostText;
