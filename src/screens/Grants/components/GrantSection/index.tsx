import { verifiedIcon } from 'assets/images';
import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStyles from './useStyles';

export type Props = {
  /**
   * Title to display at the top of the section
   */
  title: string;
  /**
   * Body of the section
   */
  description: string;
  /**
   * onPress function
   */
  onPress: () => void;
  /**
   * If the permissions are given
   */
  checked: boolean;
};

const Section: React.FC<Props> = props => {
  const { title, description, onPress, checked } = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <DropShadowWrapper
      style={{
        marginBottom: theme.spacing.l,
        backgroundColor: theme.colors.white,
        borderRadius: 12,
      }}
      outerShadowProps={{
        startColor: 'rgba(37, 87, 188, 0.07)',
        offset: [10, 20],
        distance: 40,
      }}
      innerShadowProps={{
        startColor: 'rgba(16, 24, 40, 0.05)',
        offset: [0, 1],
        distance: 8,
      }}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.titleView}>
          <Typography.Subtitle2 style={styles.title}>{title}</Typography.Subtitle2>
          <Image
            source={verifiedIcon}
            style={[styles.icon, !checked && { tintColor: theme.colors.lightGrey01 }]}
          />
          <Icon
            name="angle-right"
            color={theme.colors.surfaceBlack}
            size={24}
            allowFontScaling
            style={styles.arrowIcon}
          />
        </View>

        <Typography.Body6 style={styles.description}>{description}</Typography.Body6>
      </TouchableOpacity>
    </DropShadowWrapper>
  );
};

export default Section;
