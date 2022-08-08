import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Typography from 'components/Typography';
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
  const styles = useStyles({numTypes: postTypes.length});

  return (
    <View style={styles.container}>
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
