import * as dotenv from 'dotenv';
import {faker} from '@faker-js/faker';

// Load private variable mocks from e2e/.env
dotenv.config({path: './e2e/.env'});
const Config = process.env;

export const DETOX_DEV_MNEMONIC = Config.DETOX_DEV_MNEMONIC || '';

export const DETOX_MOCK_ACCOUNT = {
  address: 'desmos1qp3733x370mtx6e4ppfgn96u6049kk89krv7q9',
  dtag: 'detox_tester',
  profile_pic: faker.image.animals(),
  nickname: 'detox tester',
};

export const DETOX_MOCK_REST_TOKEN = 'abcdefghijklmnopqrstuvwxyz';
