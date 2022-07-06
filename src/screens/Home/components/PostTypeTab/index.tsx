import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';
import Typography from 'components/Typography';
import LinearGradient from 'react-native-linear-gradient';
import useAnimations from './useAnimations';
import useStyles from './useStyles';

type Props = {
  /**
   * The currently selected tab index.
   * Should be managed by the parent container.
   */
  selectedIndex: number;

  /**
   * Callback to set the selected tab index on the parent container.
   */
  setSelectedIndex: (idx: number) => void;

  /**
   * Selectable tab types. Component will automatically scale accordingly to
   * the amount of postTypes, however it will enforce 1 line text for each
   * label, so beware of truncated text.
   */
  postTypes: string[];
};

const PostTypeTab = ({selectedIndex, setSelectedIndex, postTypes}: Props) => {
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
            {post}
          </Typography.Button2>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PostTypeTab;
