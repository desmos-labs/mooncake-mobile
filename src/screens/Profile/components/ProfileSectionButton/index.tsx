import DropShadowWrapper from 'components/DropShadowWrapper';
import Typography from 'components/Typography';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import useStyles from './useStyles';

type Props = {
  screenMode: 'myProfile' | 'guestProfile';
  bodyLabel: string;
  titleLabel: string;
  onPress: () => void;
};

const ProfileSectionButton = ({
  screenMode,
  titleLabel,
  bodyLabel,
  onPress,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.sectionGroup}>
      <DropShadowWrapper
        customColor="rgba(133, 133, 133, 0.001)"
        customDistance={10}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <View style={{flexDirection: 'column'}}>
            <Typography.Subtitle2>{titleLabel}</Typography.Subtitle2>
            {screenMode === 'myProfile' && (
              <Typography.Body6>{bodyLabel}</Typography.Body6>
            )}
          </View>
          <Icon
            name="angle-right"
            color={theme.colors.black}
            size={24}
            allowFontScaling
          />
        </TouchableOpacity>
      </DropShadowWrapper>
    </View>
  );
};

export default ProfileSectionButton;
