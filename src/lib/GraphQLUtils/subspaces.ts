import { RegisteredReaction, ReportReason, SubspaceParams } from 'types/desmos';

/**
 * Format an incoming Subspace params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Params fetched from the server.
 * @returns {ProfileParams} - A formatted SubspaceParams object
 */
// It's fine to disable the default export here cause we might add other methods in the future
// eslint-disable-next-line import/prefer-default-export
export const convertGraphQLSubspaceParams = (params: any) =>
  ({
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
    tipsContractConfig: {
      serviceFeePercentage:
        params.tips_contract.length > 0
          ? params.tips_contract[0].config.service_fee.percentage.value
          : undefined,
    },
  } as SubspaceParams);
