import {Coin} from '@cosmjs/stargate';
import axiosInstance from 'services/axios';

type Response = {
  sender: string;
  receiver: string;
  amount: Coin[];
  block_height: string;
}[];

/**
 * Get a list of tips given a postID
 */
export const GetTipsByPostID = async ({
  postID,
}: {
  postID: number;
}): Promise<Response> => {
  const _response = await axiosInstance.get(`/contracts/tips/posts/${postID}`);

  return _response.data;
};

/**
 * Get a list of tips received given an user
 */
export const GetReceivedTipsByUser = async ({
  address,
}: {
  address: string;
}): Promise<Response> => {
  const _response = await axiosInstance.get(
    `/contracts/tips/received/${address}`,
  );

  return _response.data;
};

/**
 * Get a list of tips sent by an user
 */
export const GetSentTipsByUser = async ({
  address,
}: {
  address: string;
}): Promise<Response> => {
  const _response = await axiosInstance.get(`/contracts/tips/sent/${address}`);

  return _response.data;
};
