import { ReportReason, SubspaceParams, TipsContractConfig } from 'types/desmos';

const convertGraphQLTipsContractConfig = (
  subspaceId: number,
  contracts: any[],
): TipsContractConfig | undefined => {
  const contract = contracts.find(c => c.config.subspace_id === subspaceId.toString());
  if (!contract) {
    return undefined;
  }

  return {
    address: contract.address,
    serviceFeePercentage: contract.config.service_fee.percentage.value,
  };
};

/**
 * Format an incoming Subspace params data from the server into a format that is easier to parse by the app.
 * @param {number} subspaceId - The id of the subspace.
 * @param {any} params - Params fetched from the server.
 * @returns {ProfileParams} - A formatted SubspaceParams object
 */
// It's fine to disable the default export here because we might add other methods in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLSubspaceParams = (params: any) => {
  return {
    reportReasons: params.report_reasons.map(
      (reason: any) =>
        ({
          id: reason.id,
          title: reason.title,
          description: reason.description,
        }) as ReportReason,
    ),
  } as SubspaceParams;
};
