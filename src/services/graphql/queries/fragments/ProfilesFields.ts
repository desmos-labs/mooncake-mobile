import { gql } from '@apollo/client';

const ProfileFields = gql`
  fragment ProfileFields on profile {
    address
    bio
    dtag
    creation_time
    cover_picture: cover_pic
    nickname
    profile_picture: profile_pic
  }
`;

export default ProfileFields;
