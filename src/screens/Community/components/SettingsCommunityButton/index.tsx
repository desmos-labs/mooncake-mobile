import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import { Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStyles from './useStyles';

interface Props {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

const SettingsCommunityButton = (props: Props) => {
  const { title, subtitle, image, onPress } = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <DropShadowWrapper
      outerShadowProps={{ startColor: 'rgba(37, 87, 188, 0.06)', distance: 20 }}
      style={styles.externalContainer}
      innerStyle={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Image source={image} style={styles.image} />
        <View style={styles.textContainer}>
          <Typography.H5>{title}</Typography.H5>
          <Typography.Body7>{subtitle}</Typography.Body7>
        </View>
        <View style={styles.arrowIcon}>
          <Icon name="angle-right" color={theme.colors.surfaceBlack} size={24} allowFontScaling />
        </View>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default SettingsCommunityButton;
