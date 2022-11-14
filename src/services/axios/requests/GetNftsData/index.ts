import axios from 'axios';

/**
 * Get stargaze nfts data given an address. WIP (NO PAGINATION)
 */

const GetNftsData = async (address: string) => {
  try {
    const _response = await axios.get(
      `https://nft-api.stargaze-apis.com/api/v1beta/profile/${address}/nfts`,
    );
    return _response.data;
  } catch (e) {
    console.error(e);
  }
};

export default GetNftsData;
