import {
  ApplicationLink,
  ChainLink,
  DesmosProfile,
  PostsParams,
  ProfileParams,
  RegisteredReaction,
  ReportReason,
  SubspaceParams,
} from 'types/desmos';
import { applicationLinkStateFromJSON } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';
import { ButterConfig } from 'types/butter';

/**
 * Format an incoming Subspace params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Params fetched from the server.
 * @returns {ProfileParams} - A formatted SubspaceParams object
 */
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
      serviceFeePercentage: params.tips_contract[0].config.service_fee.percentage.value,
    },
  } as SubspaceParams);

/**
 * Format an incoming Butter config data from the server into a format that is easier to parse by the app.
 * @param {any} config - Config fetched from the server.
 * @returns {ProfileParams} - A formatted ButterConfig object
 */
export const convertGraphQLButterConfig = (config: any) =>
  ({
    desmosAddress: config.desmos_address,
    ibc: {
      channel: config.ibc.channel,
      port: config.ibc.port,
    },
    invites: {
      requiredImpactPoints: config.invites.required_impact_points,
    },
  } as ButterConfig);

/**
 * Format an incoming profiles params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos Profiles params fetched from the server.
 * @returns {ProfileParams} - A formatted ProfileParams object
 */
export const convertGraphQLProfileParams = (params: any) =>
  ({
    dTag: {
      maxLength: params.dtag.max_length,
      minLength: params.dtag.min_length,
      regEx: params.dtag.reg_ex,
    },
    nickname: {
      minLength: params.nickname.min_length,
      maxLength: params.nickname.max_length,
    },
    bio: {
      maxLength: params.bio.max_length,
    },
  } as ProfileParams);

/**
 * Format an incoming posts params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos posts params fetched from the server.
 * @returns {PostsParams} - A formatted PostsParams object
 */
export const convertGraphQLPostsParams = (params: any) =>
  ({
    maxTextLength: params.max_text_length,
  } as PostsParams);

/**
 * Format an incoming chain link data from the server into a format that is easier to parse by the app.
 * @param {any} chainLink - Chain link data retrieved from the server.
 * @returns {ChainLink} - A formatted ChainLink object
 */
export const convertGraphQLChainLink = (chainLink: any) =>
  ({
    chainName: chainLink.chainConfig.name,
    externalAddress: chainLink.externalAddress,
    userAddress: chainLink.userAddress,
    proof: {
      plainText: chainLink.proof.plainText,
      signature: chainLink.proof.signature,
    },
    creationTime: new Date(`${chainLink.creationTime}Z`),
  } as ChainLink);

/**
 * Format an incoming application link data from the server into a format that is easier to parse by the app.
 * @param {any} applicationLink - Application link data retrieved from the server.
 * @return {ApplicationLink} - A formatted ApplicationLink object.
 */
export const convertGraphQLApplicationLink = (applicationLink: any) =>
  ({
    application: applicationLink.application,
    creationTime: new Date(Date.parse(applicationLink.creationTime)),
    state: applicationLinkStateFromJSON(applicationLink.state),
    username: applicationLink.username,
  } as ApplicationLink);

export const convertGraphQLProfile = (profile: any) => profile as DesmosProfile;
