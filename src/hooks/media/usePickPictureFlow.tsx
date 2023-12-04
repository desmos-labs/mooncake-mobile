import { useEffect } from 'react';
import useChoosePicture from 'hooks/memories/useChoosePicture';
import useOpenPictureEditor from 'hooks/useOpenPictureEditor';

/**
 * Hook that provides a function that will allows the user
 * to pick a picture..
 */
const usePickPictureFlow = (onPictureChosen: (uri: string) => any) => {
  const { choosePicture, selectedPicture, setSelectedPicture } = useChoosePicture();
  const { editMemoryPicture } = useOpenPictureEditor();

  useEffect(() => {
    if (selectedPicture.uri && selectedPicture.toBeEdited) {
      editMemoryPicture(
        selectedPicture.uri,
        uri => {
          setSelectedPicture({
            uri: '',
            toBeEdited: false,
          });
          onPictureChosen(uri);
        },
        () => {
          setSelectedPicture({
            uri: '',
            toBeEdited: false,
          });
        },
      );
    }
  }, [
    editMemoryPicture,
    onPictureChosen,
    selectedPicture.toBeEdited,
    selectedPicture.uri,
    setSelectedPicture,
  ]);

  return {
    choosePicture,
    selectedPicture,
  };
};

export default usePickPictureFlow;
