export enum UploadPictureStateType {
  Unknown,
  Uploading,
  Completed,
  Failed,
}

export interface UnknownUploadState {
  readonly type: UploadPictureStateType.Unknown;
}

export enum PictureType {
  Profile,
  Cover,
}

export interface UploadingPictureState {
  readonly type: UploadPictureStateType.Uploading;
  readonly pictureType: PictureType;
}

export interface UploadPictureCompleted {
  readonly type: UploadPictureStateType.Completed;
  readonly profilePictureUrl?: string;
  readonly coverPictureUrl?: string;
}

export interface UploadPictureFailed {
  readonly type: UploadPictureStateType.Failed;
  readonly pictureType: PictureType;
  readonly error: Error;
}

export type UploadPictureState =
  | UnknownUploadState
  | UploadingPictureState
  | UploadPictureCompleted
  | UploadPictureFailed;
