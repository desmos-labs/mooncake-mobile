import {
  ApplicationLink,
  ChainLink,
  DesmosProfile,
  PostsParams,
  ProfileParams,
} from 'types/desmos';
import {applicationLinkStateFromJSON} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';

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
