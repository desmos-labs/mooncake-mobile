import CryptoES from 'crypto-es';
/**
 * Derive a safe password using the pbkdf2 algorithm.
 * @param password The password from which will be derived the safer password.
 */
export const deriveSecurePassword = (password: string): string => {
  const pw = CryptoES.PBKDF2(password, 'salt_dfp', {
    keySize: 256 / 32,
    iterations: 1000,
  });

  return pw.toString();
};
/**
 * Encrypts the provided text using the AES algorithm.
 * @param text The text to encrypt.
 * @param password The password used to generate the cipher key.
 */
export const encryptData = (text: string, password: string): string => {
  const securePassword: string = deriveSecurePassword(password);
  console.log('ENC original psw', password);
  console.log('ENC Derived psw', securePassword);
  return CryptoES.AES.encrypt(text, securePassword).toString();
};

/**
 * Decrypts data with the provided password.
 * @param data The data to be decrypted.
 * @param password The password used to generate the cipher key.
 */
export const decryptData = (data: string, password: string): string => {
  const decryptedData = CryptoES.AES.decrypt(data, password).toString(
    CryptoES.enc.Utf8,
  );

  if (!decryptedData) throw new Error('Incorrect password');
  return decryptedData;
};
