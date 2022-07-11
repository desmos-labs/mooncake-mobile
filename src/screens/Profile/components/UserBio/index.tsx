import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import useStyles from './useStyles';
import useAnimations from './useAnimations';

type Props = {
  /**
   * The user's biography
   */
  content: string;
};

const UserBio = ({content}: Props) => {
  const styles = useStyles();
  const {t} = useTranslation('profile');

  const {onLayout, animatedContainerStyle, expanded, setExpanded} =
    useAnimations();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setExpanded(prev => !prev)}>
      {/* dummy View with content so the maximum container height can be properly calculated */}
      <View pointerEvents="none" onLayout={onLayout} style={styles.dummyBio}>
        <Typography.Subtitle4>{content}</Typography.Subtitle4>
      </View>

      <Animated.View style={[animatedContainerStyle]}>
        <Typography.Subtitle4 numberOfLines={expanded ? undefined : 2}>
          {content}
        </Typography.Subtitle4>
        {/* Linear gradient effect so text for a more elegant truncate overlay */}
        {!expanded && (
          <View style={styles.gradientContainer}>
            <View style={styles.gradient}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={StyleSheet.absoluteFillObject}
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
              />
            </View>

            <Typography.Subtitle4 style={styles.moreText}>
              {t('more')}
            </Typography.Subtitle4>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default UserBio;
