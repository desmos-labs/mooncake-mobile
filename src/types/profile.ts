import { DesmosProfile } from 'types/desmos';

export interface GQLProfileResult {
  address: string;
  bio: string;
  dtag: string;
  creation_time: string;
  cover_picture: string;
  nickname: string;
  profile_picture: string;
  followers_count: number;
  following_count: number;
}

export interface GQLProfilesResult {
  profiles: GQLProfileResult[];
}

export interface ExtendedDesmosProfile extends DesmosProfile {
  followersCount: number;
  followingCount: number;
}
