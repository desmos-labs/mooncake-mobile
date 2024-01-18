import { ResultAsync } from 'neverthrow';
import { fromBase64 } from '@cosmjs/encoding';
import axiosInstance from 'services/axios';

const ResolveBranchUrl = (branchUrl: string): ResultAsync<Record<string, any>, Error> => {
  return ResultAsync.fromPromise(
    axiosInstance.get(`/links/config?deep_link=${branchUrl}`),
    (e: any) => e ?? Error('Error resolving branch url'),
  ).map(response => {
    const decodedData = Buffer.from(fromBase64(response.data.config.custom_data)).toString();
    const customData = JSON.parse(decodedData);
    return customData as Record<string, any>;
  });
};

export default ResolveBranchUrl;
