import React from 'react';
import { Box, Toast } from 'native-base';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { makeStyle } from 'config/theme';

const NewPostToast = () => {
  const { t } = useTranslation('toast');
  const styles = useStyles();

  /**
   * A swipe up gesture what will clear all visible toasts.
   */
  const swipeUpGesture = React.useMemo(
    () =>
      Gesture.Fling()
        .runOnJS(true)
        .direction(Directions.UP)
        .onStart(() => {
          // Need to use the global instance of Toast instead of the hook as the latter is not able to dismiss toasts
          // that were created outside this context.
          Toast.closeAll();
        }),
    [],
  );

  return (
    <GestureDetector gesture={swipeUpGesture}>
      <Box
        alignSelf="center"
        backgroundColor="butterOrange05"
        py="5px"
        px="13px"
        borderRadius="8px">
        <Typography.Body6 style={styles.text}>{t('newPost')}</Typography.Body6>
      </Box>
    </GestureDetector>
  );
};

const useStyles = makeStyle(theme => ({
  text: {
    color: theme.colors.butterOrange01,
  },
}));

export default NewPostToast;
