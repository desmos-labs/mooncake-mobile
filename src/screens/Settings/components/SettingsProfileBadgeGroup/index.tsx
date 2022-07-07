import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React, {useMemo} from 'react';
import {Image, ImageSourcePropType, TouchableOpacity, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {RadioButtonInput} from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStyles from './useStyles';

/**
 * Simple interface to display a radio button as a profile
 */
export interface RadioValue {
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
   * Unchecked 0 | Checked 1
   */
  status: 0 | 1;
}

interface Props {
  /**
   * Values to be displayed as radio buttons.
   */
  values: RadioValue[];
  /**
   * Callback when the user click a button.
   * @param index the values[index] on the clicked button.
   */
  onSelect: (index: number) => void;
}

const SettingsProfileBadgeGroup = (props: Props) => {
  const {values, onSelect} = props;
  const styles = useStyles();

  const testRender = () => {
    return (
      <>
        <View style={styles.outerBox}>
          <TouchableOpacity
            style={{alignSelf: 'center', margin: 'auto'}}
            onPress={() => console.log('press')}>
            <Icon
              name="trash"
              size={46}
              allowFontScaling
              style={{alignSelf: 'center'}}
            />
            <Typography.Subtitle4>remove</Typography.Subtitle4>
          </TouchableOpacity>
        </View>
        <View style={styles.outerBox}>
          <TouchableOpacity
            style={{alignSelf: 'center', margin: 'auto'}}
            onPress={() => console.log('press')}>
            <Icon
              name="edit"
              size={46}
              allowFontScaling
              style={{alignSelf: 'center'}}
            />
            <Typography.Subtitle4>remove</Typography.Subtitle4>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const wrappedValues = useMemo(() => {
    const radioValues: {label: string; value: string | number}[] | undefined =
      [];
    return values.map((value, index) => {
      radioValues.push({
        label: '',
        value: value.status,
      });
      return (
        <Swipeable
          key={`w_${index.toString()}`}
          containerStyle={styles.swipeableOuter}
          childrenContainerStyle={styles.swipeableInner}
          renderRightActions={() => testRender()}>
          <DropShadowWrapper
            style={styles.externalContainer}
            innerStyle={styles.container}>
            <Image
              source={value.profilePicture}
              style={styles.profilePicture}
            />
            <View style={styles.textContainer}>
              <Typography.H5>{value.nickname}</Typography.H5>
              <Typography.Body6>{value.dTag}</Typography.Body6>
            </View>
            <View style={styles.radioButton}>
              <RadioButtonInput
                obj={radioValues}
                index={index}
                isSelected={value.status !== 0}
                onPress={() => onSelect(index)}
                buttonSize={12}
                // @ts-ignore
                borderWidth={2}
                buttonInnerColor="#F3725A"
                buttonOuterColor="#F3725A"
              />
            </View>
          </DropShadowWrapper>
        </Swipeable>
      );
    });
  }, [values]);

  return <View>{wrappedValues}</View>;
};

export default SettingsProfileBadgeGroup;
