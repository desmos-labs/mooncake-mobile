import BCheckbox from 'components/BCheckbox';
import AvatarImage from 'components/AvatarImage';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import React from 'react';
import { View } from 'react-native';
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

  const onCheckBoxStateChange = React.useCallback(
    (state: boolean) => {
      onSelectChange(profile, state);
    },
    [profile, onSelectChange],
  );

  return (
    <View style={styles.root}>
      <AvatarImage imageSource={profile} size={40} disabled={disabled} />
      <Spacer paddingLeft={12} />
      <View style={styles.profileInfo}>
        <Typography.Subtitle2 style={disabled ? styles.disabledText : undefined}>
          {profile.nickname}
        </Typography.Subtitle2>
        <Typography.Body6 style={disabled ? styles.disabledText : undefined}>
          @{profile.dTag}
        </Typography.Body6>
      </View>
      <BCheckbox value={selected} onValueChange={onCheckBoxStateChange} disabled={disabled} />
    </View>
  );
};

export default CreatorListItem;

const useStyles = makeStyle(theme => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.neutral['100'],
    padding: 12,
    marginBottom: theme.spacing.m,
  },
  profileInfo: {
    flex: 1,
  },
  disabledText: {
    color: theme.colors.lightGrey02,
  },
}));
