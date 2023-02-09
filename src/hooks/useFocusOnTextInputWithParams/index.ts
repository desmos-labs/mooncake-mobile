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
    textInputRef.current.focus();
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
  }, [focusTextInputRef, params.focusCommentBox, textInputRef]);

  return {
    focusTextInputRef,
    textInputRef,
  };
};

export default useFocusTextInputOnNavigate;
