import {formatNumShorthand} from 'lib/FormatUtils';
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
  sections: {sectionName: string; counter: number}[];
};

const InteractionSwitch = ({
  selectedIndex,
  setSelectedIndex,
  sections,
}: Props) => {
  const styles = useStyles({numTypes: sections.length});

  return (
    <View style={styles.container}>
      {sections.map((section, idx) => (
        <TouchableOpacity
          key={section.sectionName}
          onPress={() => setSelectedIndex(idx)}
          style={styles.tabButton}>
          <Typography.Button2
            numberOfLines={1}
            style={[
              styles.buttonText,
              idx === selectedIndex ? styles.selected : styles.unselected,
            ]}>
            {section.sectionName} {formatNumShorthand(section.counter)}
          </Typography.Button2>

          {selectedIndex === idx && <View style={styles.selectedIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default InteractionSwitch;
