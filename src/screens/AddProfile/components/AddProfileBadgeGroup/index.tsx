import React from 'react';
import {ImageSourcePropType, View} from 'react-native';
import {PanGestureHandlerProps} from 'react-native-gesture-handler';
import AddProfileBadge from '../AddProfileBadge';

/**
 * Simple interface to display a radio button as a profile
 */
export interface ProfileRadioValue {
  /**
   * The id of the profile
   */
  id: string;
  /**
   * The nickname to display over the dTag
   */
  nickname: string;
  /**
   * The dTag to display under the nickname
   */
  dTag: string;
  /**
   * The picture to display, can be and asset or a url
   */
  profilePicture: ImageSourcePropType;
  /**
   * Is the badge selected
   */
  isSelected: boolean;
  /**
   * Is the badge disabled
   */
  disabled: boolean;
}

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  /**
   * Values to be displayed as radio buttons.
   */
  values: ProfileRadioValue[];
  /**
   * Callback when the user click a button.
   * @param index the values[index] on the clicked button.
   */
  onSelect: (id: string) => void;
}

const AddProfileBadgeGroup = (props: Props) => {
  const {values, onSelect} = props;

  return (
    <View>
      {values.map(value => (
        <AddProfileBadge
          value={value}
          onSelect={onSelect}
          key={value.id}
          disabled={value.disabled}
        />
      ))}
    </View>
  );
};

export default AddProfileBadgeGroup;
