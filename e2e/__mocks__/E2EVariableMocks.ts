import * as dotenv from 'dotenv';

// Load private variable mocks from e2e/.env
dotenv.config({path: './e2e/.env'});
const Config = process.env;
console.log(Config);
export const DETOX_DEV_MNEMONIC = Config.DETOX_DEV_MNEMONIC || '';
export const DETOX_DEV_ACCOUNT_NICKNAME =
  Config.DETOX_DEV_ACCOUNT_NICKNAME || '';
export const DETOX_DEV_BLANK_MNEMONIC = Config.DETOX_DEV_BLANK_MNEMONIC || '';
