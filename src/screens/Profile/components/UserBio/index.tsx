import Typography from 'components/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  /**
   * The user's biography
   */
  content: string;
};

const UserBio = ({ content }: Props) => {
  const [collapsed, setCollapsed] = useState(true);
  const [maxLines, setMaxLines] = useState<number | undefined>(1);
  const animationHeight = useSharedValue(16);
  const { t } = useTranslation('profile');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      maxHeight: animationHeight.value,
    };
  });

  const collapseView = () => {
    animationHeight.value = withTiming(21, { duration: 200 }, isFinished => {
      if (isFinished) {
        runOnJS(setMaxLines)(1);
      }
    });
  };

  const expandView = () => {
    setMaxLines(undefined);
    animationHeight.value = withTiming(500, {
      duration: 200,
    });
  };

  useEffect(() => {
    if (collapsed) {
      collapseView();
    } else {
      expandView();
    }
  }, [collapsed]);

  if (!content) {
    return <Typography.Body7 style={{ textAlign: 'left' }}>{t('noBio')}</Typography.Body7>;
  }

  return (
    <TouchableOpacity onPress={() => setCollapsed(prevState => !prevState)} activeOpacity={0.8}>
      <Animated.View style={animatedStyle}>
        <Typography.Body7 numberOfLines={maxLines} ellipsizeMode="tail">
          {content}
        </Typography.Body7>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default UserBio;
