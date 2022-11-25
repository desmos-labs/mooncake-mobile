import React from 'react';
import {View} from 'react-native';
import {Source} from 'react-native-fast-image';
import {PanGestureHandlerProps} from 'react-native-gesture-handler';
import SettingsProfileBadge from 'screens/Profiles/components/SettingsProfileBadge';

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
  profilePicture: Source;
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
  /**
   * Callback when the user click the edit profile button.
   * @param index the values[index] on the clicked button.
   */
  onEditProfile: (index: number) => void;
  /**
   * Callback when the user click the remove profile button.
   * @param index the values[index] on the clicked button.
   */
  onRemoveProfile: (index: number) => void;
}

const SettingsProfileBadgeGroup = (props: Props) => {
  const {
    values,
    onSelect,
    onEditProfile,
    onRemoveProfile,
    simultaneousHandlers,
  } = props;

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
            onEditProfile={onEditProfile}
            onRemoveProfile={onRemoveProfile}
            simultaneousHandlers={simultaneousHandlers}
            key={value.dTag}
          />
        );
      })}
    </View>
  );
};

export default SettingsProfileBadgeGroup;
