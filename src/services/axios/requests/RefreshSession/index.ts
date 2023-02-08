import axiosInstance from 'services/axios';

/**
 * Refresh the user's token validity
 */
const RefreshSession = async () => {
  const _response = await axiosInstance.post('/session');

  if (_response.status !== 200) {
    throw new Error(
      `There was an issue refreshing the session:\n\n${JSON.stringify(_response.data)}`,
    );
  } else {
    console.log('Session refreshed');
  }
};

export default RefreshSession;
