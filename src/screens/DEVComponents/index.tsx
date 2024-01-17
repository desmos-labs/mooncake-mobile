import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import DView from 'components/DView';
import Toasts, { ToastProps } from 'components/Toasts';
import TopBar from 'components/TopBar';
import { makeStyle } from 'config/theme';
import Spacer from 'components/Spacer';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { View } from 'react-native';
import Button from 'components/Button';

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.DEV_COMPONENTS>;

/**
 * Screen that display a set of component to see how they render.
 */
const DevComponents: React.FC<NavProps> = () => {
  const styles = useStyles();

  const [toast, setToast] = React.useState<'success' | 'error'>('success');

  const Toast = React.useCallback(
    (props: ToastProps) => {
      if (toast === 'success') {
        return <Toasts.Success {...props} />;
      } else {
        return <Toasts.Error {...props} />;
      }
    },
    [toast],
  );

  return (
    <DView style={styles.root} topBar={<TopBar />} scrollable>
      {/* Toasts debugger */}
      <Typography.Semibold16>Toasts selector</Typography.Semibold16>
      <View style={styles.inlineButtons}>
        <Button variant="outline" onPress={() => setToast('success')}>
          Success
        </Button>
        <Button variant="outline" onPress={() => setToast('error')}>
          Error
        </Button>
      </View>
      {/* Toasts with title */}
      <Typography.Semibold16>Toasts with title</Typography.Semibold16>
      <Toast
        title="Success"
        message="This is a test toast with a very long text to test the rendering"
      />
      <Spacer paddingTop="s" />
      <Toast
        title="Success"
        message="This is a test toast with a very long text to test the rendering"
        showLoadingAnimation
      />
      <Spacer paddingTop="s" />
      <Toast
        title="Success"
        message="This is a test toast with a very long text to test the rendering"
        showLoadingAnimation
        actionLabel="Ok"
        action={() => {
          console.warn('ok');
        }}
      />
      <Spacer paddingTop="s" />
      {/* Toasts without title */}
      <Typography.Semibold16>Toasts without title</Typography.Semibold16>
      <Toast message="This is a test toast with a very long text to test the rendering" />
      <Spacer paddingTop="s" />
      <Toast
        message="This is a test toast with a very long text to test the rendering"
        showLoadingAnimation
      />
      <Spacer paddingTop="s" />
      <Toast
        message="This is a test toast with a very long text to test the rendering"
        showLoadingAnimation
        actionLabel="Ok"
        action={() => {
          console.warn('ok');
        }}
      />
      <Spacer paddingTop="s" />
    </DView>
  );
};

export default DevComponents;

const useStyles = makeStyle(() => ({
  root: {
    paddingHorizontal: 20,
  },
  inlineButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
