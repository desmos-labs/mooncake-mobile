import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import AvatarImage from 'components/AvatarImage';
import BCheckbox from 'components/BCheckbox';
import Spacer from 'components/Spacer';
import { makeStyle } from 'config/theme';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { DesmosProfile } from 'types/desmos';

interface CreatorListItemProps {
  /**
   * Profile of the creator that will be displayed.
   */
  readonly profile: DesmosProfile;
  /**
   * Tells if the creator is selected.
   */
  readonly selected: boolean;
  /**
   * Tells if the item should be disabled.
   * If true, the item will display the creator information in gray
   * and the user will not be able to select it.
   */
  readonly disabled?: boolean;
  /**
   * Callback that will be called when the user selects the creator.
   */
  readonly onSelectChange: (profile: DesmosProfile, selected: boolean) => void;
}

const CreatorListItem: React.FC<CreatorListItemProps> = ({
  profile,
  selected,
  disabled,
  onSelectChange,
}) => {
  const styles = useStyles();

  const onPress = React.useCallback(() => {
    onSelectChange(profile, !selected);
  }, [onSelectChange, profile, selected]);

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View style={styles.root}>
        <AvatarImage imageSource={profile} size={40} disabled={disabled} />
        <Spacer paddingLeft={12} />
        <View style={styles.profileInfo}>
          <Typography.Semibold16 style={disabled ? styles.disabledText : undefined}>
            {profile.nickname}
          </Typography.Semibold16>
          <Typography.Regular14 style={disabled ? styles.disabledText : styles.neutral700}>
            @{profile.dTag}
          </Typography.Regular14>
        </View>
        <BCheckbox value={selected} disabled={disabled} />
      </View>
    </TouchableOpacity>
  );
};

export default CreatorListItem;

const useStyles = makeStyle(theme => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.background,
    shadowColor: Platform.OS === 'ios' ? 'rgba(10, 10, 10, 0.1)' : 'rgba(10, 10, 10, 0.5)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 20,

    elevation: 10,
  },
  profileInfo: {
    flex: 1,
  },
  disabledText: {
    color: theme.colors.lightGrey02,
  },
  neutral700: {
    color: theme.colors.neutral['700'],
  },
}));
