import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated from 'react-native-reanimated';
import Typography from 'components/Typography';
import LinearGradient from 'react-native-linear-gradient';
import useAnimations from './useAnimations';
import useStyles from './useStyles';

type Props = {
  selectedIndex: number;

  setSelectedIndex: (idx: number) => void;

  postTypes: string[];
};

const PostTypeTab = ({selectedIndex, setSelectedIndex, postTypes}: Props) => {
  const {t} = useTranslation('home');
  const {setOffset, animatedStyles} = useAnimations();

  const styles = useStyles({numTypes: postTypes.length});

  React.useEffect(() => {
    setOffset((selectedIndex / postTypes.length) * 100);
  }, [selectedIndex]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          {
            width: `${100 / postTypes.length}%`,
          },
          styles.tabIndicator,
          animatedStyles,
        ]}>
        <LinearGradient
          style={styles.gradient}
          colors={[
            'rgba(255, 199, 91, 1)',
            'rgba(255, 132, 79, 1)',
            'rgba(255, 132, 79, 1)',
            'rgba(255, 132, 79, 1)',
          ]}
        />
      </Animated.View>
      {postTypes.map((post, idx) => (
        <TouchableOpacity
          onPress={() => setSelectedIndex(idx)}
          style={styles.tabButton}>
          <Typography.Button2
            numberOfLines={1}
            style={[
              styles.buttonText,
              idx === selectedIndex ? styles.selected : styles.unselected,
            ]}>
            {t(post)}
          </Typography.Button2>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PostTypeTab;
