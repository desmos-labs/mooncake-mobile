import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import {addAlphaToHex} from 'config/theme';
import {useTheme} from 'react-native-paper';
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
  const theme = useTheme();

  const {onLayout, animatedContainerStyle, expanded, setExpanded} =
    useAnimations();

  const showMoreLess = React.useMemo(() => content.length > 64, [content]);

  if (!content) {
    return (
      <Typography.Caption1 style={{textAlign: 'center'}}>
        {t('noBio')}
      </Typography.Caption1>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (showMoreLess) setExpanded(prev => !prev);
      }}>
      {/* dummy View with content so the maximum container height can be properly calculated */}
      <View pointerEvents="none" onLayout={onLayout} style={styles.dummyBio}>
        <Typography.Subtitle4>{content}</Typography.Subtitle4>
      </View>

      <Animated.View style={[animatedContainerStyle]}>
        <Typography.Caption1 numberOfLines={expanded ? undefined : undefined}>
          {content}
          {expanded && showMoreLess ? (
            <Typography.Caption1 style={styles.moreText}>
              {t('less')}
            </Typography.Caption1>
          ) : undefined}
        </Typography.Caption1>
        {/* Linear gradient effect so text for a more elegant truncate overlay */}
        {!expanded && showMoreLess && (
          <View style={styles.gradientContainer}>
            <View style={styles.gradient}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={StyleSheet.absoluteFillObject}
                colors={[
                  addAlphaToHex(theme.colors.background, 0.1),
                  theme.colors.background,
                ]}
              />
            </View>
            <Typography.Caption1 style={styles.moreText}>
              {t('more')}
            </Typography.Caption1>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default UserBio;
