const mockKeychain = {
  ACCESSIBLE: {
    WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 0
  },
  SECURITY_LEVEL_ANY: "MOCK_SECURITY_LEVEL_ANY",
  SECURITY_LEVEL_SECURE_SOFTWARE: "MOCK_SECURITY_LEVEL_SECURE_SOFTWARE",
  SECURITY_LEVEL_SECURE_HARDWARE: "MOCK_SECURITY_LEVEL_SECURE_HARDWARE",
  setGenericPassword: jest.fn().mockResolvedValue(true),
  getGenericPassword: jest.fn().mockResolvedValue({password: '[{}]'}),
  resetGenericPassword: jest.fn().mockResolvedValue(true),
  getAllGenericPasswordServices: jest.fn().mockResolvedValue(true)
}

export default mockKeychain;
