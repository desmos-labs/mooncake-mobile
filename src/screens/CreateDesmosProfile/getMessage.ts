import {MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import {GenericMsgEnums} from 'lib/desmos/msgtypes';

// Save new wallet as last selected wallet
// Build save profile message
function getMessage(
  creator: string,
  dTag: string,
  nickname: string,
  bio: string,
  profilePictureUrl: string | undefined,
  coverPictureUrl: string | undefined,
): MsgSaveProfileEncodeObject[] {
  // Save new wallet as last selected wallet
  // Build save profile message
  const saveProfileMessage: MsgSaveProfileEncodeObject = {
    typeUrl: GenericMsgEnums.MsgSaveProfile,
    value: {
      creator,
      dtag: dTag,
      nickname: nickname || '[do-not-modify]',
      bio: bio || '[do-not-modify]',
      profilePicture: profilePictureUrl || '[do-not-modify]',
      coverPicture: coverPictureUrl || '[do-not-modify]',
    },
  };
  return [saveProfileMessage];
}

export default getMessage;
