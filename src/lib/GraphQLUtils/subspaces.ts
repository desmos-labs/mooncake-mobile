import { RegisteredReaction, ReportReason, SubspaceParams, TipsContractConfig } from 'types/desmos';

const convertGraphQLTipsContractConfig = (config: any): TipsContractConfig | undefined => {
  const tipsContractConfig = config.length > 0 ? config.tips_contract[0] : undefined;
  if (!tipsContractConfig) {
    return undefined;
  }

  return {
    address: tipsContractConfig.config.address,
    serviceFeePercentage: tipsContractConfig.config.service_fee.percentage.value,
  };
};

/**
 * Format an incoming Subspace params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Params fetched from the server.
 * @returns {ProfileParams} - A formatted SubspaceParams object
 */
// It's fine to disable the default export here because we might add other methods in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLSubspaceParams = (params: any) => {
  return {
    registeredReactions: params.registered_reactions.map(
      (reaction: any) =>
        ({
          id: reaction.id,
          displayValue: reaction.display_value,
          shortHandCode: reaction.shorthand_code,
        } as RegisteredReaction),
    ),
    reportReasons: params.report_reasons.map(
      (reason: any) =>
        ({
          id: reason.id,
          title: reason.title,
          description: reason.description,
        } as ReportReason),
    ),
    tipsContractConfig: convertGraphQLTipsContractConfig(params.tips_contract),
  } as SubspaceParams;
};
