import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
// dismiss button
// import {iconCross} from 'assets/images';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {ReactNode} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage, {Source} from 'react-native-fast-image';
import useStyles from './useStyles';

export type TextOnlyModalParams = {
  /**
   * The title of the modal. This should be the immediate result
   * of whatever the user was doing.
   */
  title?: string | ReactNode;
  /**
   * Additional description for the title.
   */
  body?: string | ReactNode;
  bodyStyle?: StyleProp<TextStyle>;
  image?: Source;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.TEXTONLY_MODAL>;

const TextOnlyModal = () => {
  const {
    params: {title, body, bodyStyle, image},
  } = useRoute<NavProps['route']>();

  const styles = useStyles();

  const {goBack} = useNavigation<NavProps['navigation']>();

  return (
    <View style={styles.container}>
      {/* invoke dismiss fn or goBack if user presses the background */}
      <TouchableOpacity
        onPress={goBack}
        activeOpacity={1}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.innerContainer}>
        {image && (
          <FastImage
            source={image}
            style={{width: 116, height: 116, alignSelf: 'center'}}
          />
        )}
        <Typography.H5 style={bodyStyle}>{title}</Typography.H5>
        <Typography.Body6 style={[styles.subtitleText, bodyStyle]}>
          {body}
        </Typography.Body6>
      </View>
    </View>
  );
};

export default TextOnlyModal;
