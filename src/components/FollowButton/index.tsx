import React, {ComponentProps, FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import Button from 'components/Button';
import {Text} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import useStyles from './useStyles';
import SVGComponent from './background';

type Props = ComponentProps<typeof Button> & {
  subspaceID: number;
  counterPartyAddress: string;
  creatorAddrees: string;
};

const FollowButton: FC<Props> = props => {
  const {
    style,
    labelStyle,
    children,
    onPress,
    subspaceID,
    counterPartyAddress,
    creatorAddrees,
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
  }, [subspaceID, counterPartyAddress, creatorAddrees]);

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
      <Text style={[styles.label, labelStyle]}>{children || t('follow')}</Text>
    </TouchableOpacity>
  );
};

export default FollowButton;
