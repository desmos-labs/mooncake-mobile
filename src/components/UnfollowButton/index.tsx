import React, {ComponentProps, FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import {Text} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import useStyles from './useStyles';
import SVGComponent from './background';

type Props = ComponentProps<typeof Button> & {
  subspaceID: number;
  creatorAddrees: string;
  counterPartyAddress: string;
};

const UnfollowButton: FC<Props> = props => {
  const {
    style,
    labelStyle,
    children,
    onPress,
    subspaceID,
    creatorAddrees,
    counterPartyAddress,
    ...rest
  } = props;
  const styles = useStyles();
  const {t} = useTranslation('followingAndFollowers');

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      // to do
    }
  }, [subspaceID, creatorAddrees, counterPartyAddress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, style]}
      {...rest}>
      <SVGComponent
        style={styles.svg}
        width={styles.button.width}
        height={styles.button.height}
      />
      <Text style={[styles.label, labelStyle]}>
        {children || t('unfollow')}
      </Text>
    </TouchableOpacity>
  );
};

export default UnfollowButton;
