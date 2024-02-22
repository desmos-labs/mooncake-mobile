/**
 * Tells whether the given picture is stored on the local device.
 * @param pictureUri - URI of the picture to be checked.
 */
// Disable the default export warning as we might have more functions in the future.
// eslint-disable-next-line import/prefer-default-export
export const isPictureLocal = (pictureUri: string | undefined): pictureUri is string => {
  return (
    pictureUri !== undefined && (pictureUri.startsWith('file://') || pictureUri.startsWith('/'))
  );
};
