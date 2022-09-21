import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import {Image, View} from 'react-native';
import {PanGestureHandlerProps} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import {RadioButtonInput} from 'react-native-simple-radio-button';
import {ProfileRadioValue} from 'screens/Profiles/components/SettingsProfileBadgeGroup';
import useStyles from './useStyles';

interface Props extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  /**
   * Values to be displayed as radio buttons.
   */
  value: ProfileRadioValue;
  index: number;
  /**
   * Callback when the user click a button.
   * @param index the values[index] on the clicked button.
   */
  onSelect: (index: number) => void;
}

const SettingsProfileBadge = (props: Props) => {
  const {value, index, onSelect} = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View>
      <DropShadowWrapper
        style={styles.externalContainer}
        innerStyle={styles.container}>
        <Image source={value.profilePicture} style={styles.profilePicture} />
        <View style={styles.textContainer}>
          <Typography.H5>{value.nickname}</Typography.H5>
          <Typography.Body6>{value.dTag}</Typography.Body6>
        </View>
        <View style={styles.radioButton}>
          <RadioButtonInput
            obj={value}
            index={index}
            isSelected={value.isSelected}
            onPress={() => onSelect(index)}
            buttonSize={12}
            // @ts-ignore
            borderWidth={2}
            buttonInnerColor={theme.colors.butterOrange01}
            buttonOuterColor={theme.colors.butterOrange01}
          />
        </View>
      </DropShadowWrapper>
    </View>
  );
};

export default SettingsProfileBadge;
