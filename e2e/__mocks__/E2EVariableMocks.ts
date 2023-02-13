import * as dotenv from 'dotenv';
import {faker} from '@faker-js/faker';

// Load private variable mocks from e2e/.env
dotenv.config({path: './e2e/.env'});
const Config = process.env;
console.log(Config);
export const DETOX_DEV_MNEMONIC = Config.DETOX_DEV_MNEMONIC || '';
export const DETOX_DEV_ACCOUNT_NICKNAME =
  Config.DETOX_DEV_ACCOUNT_NICKNAME || '';
export const DETOX_DEV_BLANK_MNEMONIC = Config.DETOX_DEV_BLANK_MNEMONIC || '';

export const DETOX_MOCK_ACCOUNT = {
  address: 'desmos123',
  dtag: 'detox_tester',
  profile_pic: faker.image.animals(),
  nickname: 'detox tester',
};

export const DETOX_MOCK_REST_TOKEN = 'abcdefghijklmnopqrstuvwxyz';
