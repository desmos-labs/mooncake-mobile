import { ProfileParams } from 'types/desmos';
import { ExtendedDesmosProfile, GQLProfileResult } from 'types/profile';

/**
 * Format an incoming profiles params data from the server into a format that is easier to parse by the app.
 * @param {any} params - Desmos Profiles params fetched from the server.
 * @returns {ProfileParams} - A formatted ProfileParams object
 */
export const convertGraphQLProfileParams = (params: any): ProfileParams => {
  return {
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
  } as ProfileParams;
};

/**
 * Format an incoming profile data from the server into a format that is easier to parse by the app.
 * @param {any} profile - Desmos Profile data fetched from the server.
 * @returns {ExtendedDesmosProfile} - A formatted ExtendedDesmosProfile object
 */
export const convertGraphQLProfile = (profile: GQLProfileResult): ExtendedDesmosProfile => {
  return {
    dTag: profile.dtag,
    address: profile.address,
    bio: profile.bio,
    profilePicture: profile.profile_picture?.length ? profile.profile_picture : undefined,
    coverPicture: profile.cover_picture?.length ? profile.cover_picture : undefined,
    nickname: profile.nickname,
    creationTime: profile.creation_time,
    followersCount: profile.followers_count,
    followingCount: profile.following_count,
  };
};
