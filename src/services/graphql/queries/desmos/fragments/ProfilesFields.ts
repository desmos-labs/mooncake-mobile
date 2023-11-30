import { gql } from '@apollo/client';

const ProfileFields = gql`
  fragment ProfileFields on profile {
    address
    bio
    dTag: dtag
    creation_time
    coverPicture: cover_pic
    nickname
    profilePicture: profile_pic
    creationTime: creation_time
  }
`;

export default ProfileFields;
