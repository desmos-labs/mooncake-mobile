import { useCallback, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';

/**
 * A reusable hook that opens the keyboard and focuses on textInputRef, which should be
 * a ref to an InputField component.
 */
const useFocusTextInputOnNavigate = () => {
  const { params } = useRoute<any>();
  const textInputRef = useRef<any>(null);

  /**
   * Main keyboard focus callback for use when user presses the comment button
   */
  const focusTextInputRef = useCallback(() => {
    textInputRef && textInputRef.current && textInputRef.current.focus();
  }, [textInputRef]);

  /**
   * Open the comment text input if focusCommentBox is passed as nav param.
   */
  useEffect(() => {
    if (textInputRef && textInputRef.current) {
      if (params.focusCommentBox) {
        setTimeout(() => {
          focusTextInputRef();
        }, 200);
      }
    }
    // We need to ignore this warning as it flags the textInputRef.current dep as invalid, when it is
    // necessary to detect if the reference has been properly set so that the app can focus on the text input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTextInputRef, params.focusCommentBox, textInputRef.current]);

  return {
    focusTextInputRef,
    textInputRef,
  };
};

export default useFocusTextInputOnNavigate;
