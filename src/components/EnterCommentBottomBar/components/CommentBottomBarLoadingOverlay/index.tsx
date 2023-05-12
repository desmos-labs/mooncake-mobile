import React from 'react';
import { StyleSheet } from 'react-native';
import { makeStyle } from 'config/theme';
import { Box } from 'native-base';

/**
 * A loading overlay that is displayed over the EnterCommentBottomBar in order to block
 * user input and show some feedback to the user when a comment is being posted.
 */
const CommentBottomBarLoadingOverlay = () => {
  const styles = useStyles();

  return <Box alignItems="center" justifyContent="center" style={styles.container} />;
};

const useStyles = makeStyle(theme => ({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.midGrey,
    opacity: 0.2,
  },
}));

export default CommentBottomBarLoadingOverlay;
