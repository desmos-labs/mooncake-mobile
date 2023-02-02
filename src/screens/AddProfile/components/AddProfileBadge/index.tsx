import { defaultProfilePic } from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { PanGestureHandlerProps } from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import { RadioButtonInput } from 'react-native-simple-radio-button';
import useStyles from './useStyles';

/**
 * Simple interface to display a radio button as a profile
 */
export interface AddProfileRadioValue {
  /**
   * The id of the profile
   */
  address: string;
  /**
   * The nickname to display over the dTag
   */
  nickname: string;
  /**
   * The dTag to display under the nickname
   */
  dtag: string;
  /**
   * The picture to display as url
   */
  profile_pic: string;
  /**
   * Is the badge selected
   */
  isSelected: boolean;
}

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  /**
   * Values to be displayed as radio buttons.
   */
  value: AddProfileRadioValue;
  /**
   * Callback when the user click a button.
   * @param id the id on the clicked button.
   */
  onSelect?: (id: string) => void;
  /**
   * Is the badge disabled
   */
  disabled?: boolean;
}

const AddProfileBadge = (props: Props) => {
  const { value, onSelect, disabled } = props;
  const styles = useStyles();
  const theme = useTheme();
  const handleSelect = useCallback(() => {
    if (!disabled && onSelect) {
      onSelect(value.address);
    }
  }, [disabled, onSelect, value.address]);

  const { nickname, dtag, profile_pic, isSelected } = value;

  return (
    <TouchableOpacity onPress={handleSelect} disabled={disabled}>
      <DropShadowWrapper
        style={[styles.externalContainer, disabled && styles.externalContainerDisabled]}
        innerStyle={styles.container}>
        <FastImage
          source={profile_pic ? { uri: profile_pic } : defaultProfilePic}
          style={styles.profilePicture}
        />
        <View style={styles.textContainer}>
          {nickname && (
            <Typography.H5 numberOfLines={2} ellipsizeMode="middle">
              {nickname}
            </Typography.H5>
          )}
          <Typography.Body6 numberOfLines={2} ellipsizeMode="middle">
            {dtag}
          </Typography.Body6>
        </View>
        <View style={[styles.radioButton, disabled && styles.radioButtonDisabled]}>
          <RadioButtonInput
            obj={value}
            isSelected={isSelected}
            onPress={handleSelect}
            buttonSize={12}
            // @ts-ignore
            borderWidth={2}
            buttonInnerColor={theme.colors.butterOrange01}
            buttonOuterColor={theme.colors.butterOrange01}
          />
        </View>
      </DropShadowWrapper>
    </TouchableOpacity>
  );
};

export default AddProfileBadge;
