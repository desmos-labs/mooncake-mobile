import React from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import Spacer from 'components/Spacer';
import DView from 'components/DView';
import LocalWallet, {randomMnemonic} from 'lib/LocalWallet';

// Add the ROUTE enum of the screens that should be rendered here
const routesToRender = [
  ROUTES.CONSENT_AGREEMENT,
  ROUTES.LOOKING_FOR_DEVICES,
  ROUTES.NO_DTAG_FOUND,
  ROUTES.CONNECT_TO_LEDGER,
  ROUTES.CREATE_DESMOS_PROFILE,
  ROUTES.LANDING,
  ROUTES.WELCOME_BACK,
];

const DevScreen = () => {
  const {navigate} = useNavigation();

  React.useEffect(() => {
    const generateWallet = async () => {
      const mnemonic = randomMnemonic();

      console.log('i am mnemonic');

      const wallet = await LocalWallet.fromMnemonic(mnemonic);

      console.log(wallet.publicKey);
    };

    setTimeout(() => {
      generateWallet();
    }, 3000);
  }, []);

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigate(item);
        }}
        style={{padding: 18, borderWidth: 1, borderColor: 'grey'}}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorComponent = React.useCallback(
    () => <Spacer paddingVertical={8} />,
    [],
  );

  return (
    <DView>
      <FlatList
        contentContainerStyle={{
          padding: 16,
        }}
        data={routesToRender}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </DView>
  );
};

export default DevScreen;
