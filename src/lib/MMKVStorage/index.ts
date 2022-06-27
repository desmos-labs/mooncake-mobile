import {MMKV} from 'react-native-mmkv';
import EnvConfig from 'config/EnvConfig';

const MMKVStorage = new MMKV({
  id: EnvConfig.MMKV_ID,
});

export default MMKVStorage;
