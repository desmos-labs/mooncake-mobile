import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {ReactNode, useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import useStyles from './useStyles';

export type BottomModalParams = {
  /**
   * The title of the modal. This should be the immediate result
   * of whatever the user was doing.
   */
  title?: string | ReactNode;
  /**
   * Body text.
   */
  body?: string | ReactNode;
  /**
   * Label of the primary button.
   */
  primaryButtonLabel: string;
  /**
   * What to do when the user presses the primary (main) modal button.
   */
  onPressPrimary?: () => void;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BOTTOM_MODAL>;

const BottomModal = () => {
  const {
    params: {title, body, primaryButtonLabel, onPressPrimary},
  } = useRoute<NavProps['route']>();
  const styles = useStyles();

  const {goBack} = useNavigation<NavProps['navigation']>();

  const onPressButton = useCallback(() => {
    onPressPrimary && onPressPrimary();
    goBack();
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={goBack}
      style={styles.container}>
      {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
      {/* parts of the modal content are pressed */}
      <TouchableOpacity activeOpacity={1} style={styles.innerContainer}>
        <View style={styles.tabIcon} />
        <Typography.H4 style={styles.headerText}>{title}</Typography.H4>
        <Typography.Body5>{body}</Typography.Body5>

        <Spacer paddingVertical={40}>
          <Button mode="gradientFilled" onPress={onPressButton}>
            {primaryButtonLabel}
          </Button>
        </Spacer>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default BottomModal;
