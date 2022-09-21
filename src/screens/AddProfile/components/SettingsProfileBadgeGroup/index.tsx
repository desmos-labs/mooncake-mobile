import React from 'react';
import {ImageSourcePropType, View} from 'react-native';
import {PanGestureHandlerProps} from 'react-native-gesture-handler';
import SettingsProfileBadge from '../SettingsProfileBadge';

/**
 * Simple interface to display a radio button as a profile
 */
export interface ProfileRadioValue {
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
  onSelect: (index: number) => void;
}

const SettingsProfileBadgeGroup = (props: Props) => {
  const {values, onSelect} = props;

  const radioValues: {label: string; value: string | number}[] | undefined = [];

  return (
    <View>
      {values.map((value, index) => {
        radioValues.push({
          label: '',
          value: +value.isSelected,
        });
        return (
          <SettingsProfileBadge
            value={value}
            index={index}
            onSelect={onSelect}
            key={value.dTag}
          />
        );
      })}
    </View>
  );
};

export default SettingsProfileBadgeGroup;
