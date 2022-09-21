import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React, {useCallback} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {PanGestureHandlerProps} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import {RadioButtonInput} from 'react-native-simple-radio-button';
import {ProfileRadioValue} from '../AddProfileBadgeGroup';
import useStyles from './useStyles';

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  /**
   * Values to be displayed as radio buttons.
   */
  value: ProfileRadioValue;
  /**
   * Callback when the user click a button.
   * @param id the id on the clicked button.
   */
  onSelect: (id: string) => void;
  /**
   * Is the badge disabled
   */
  disabled: boolean;
}

const AddProfileBadge = (props: Props) => {
  const {value, onSelect} = props;
  const styles = useStyles();
  const theme = useTheme();
  const handleSelect = useCallback(() => {
    if (!value.disabled) {
      onSelect(value.id);
    }
  }, [onSelect, value.id, value.disabled]);

  const {nickname, dTag, profilePicture, isSelected, disabled} = value;

  const components = (
    <DropShadowWrapper
      style={[
        styles.externalContainer,
        disabled && styles.externalContainerDisabled,
      ]}
      innerStyle={styles.container}>
      <Image source={profilePicture} style={styles.profilePicture} />
      <View style={styles.textContainer}>
        {nickname && (
          <Typography.H5 numberOfLines={2} ellipsizeMode="middle">
            {nickname}
          </Typography.H5>
        )}
        <Typography.Body6 numberOfLines={2} ellipsizeMode="middle">
          {dTag}
        </Typography.Body6>
      </View>
      <View
        style={[styles.radioButton, disabled && styles.radioButtonDisabled]}>
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
  );

  if (disabled) {
    return <View>{components}</View>;
  }

  return (
    <TouchableOpacity onPress={handleSelect} activeOpacity={1}>
      {components}
    </TouchableOpacity>
  );
};

export default AddProfileBadge;
