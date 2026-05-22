import { useState } from "react";

export function useUserFeedback() {
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  function submitFeedback() {
    setIsFeedbackSubmitted(true);
  }

  return { isFeedbackSubmitted, submitFeedback };
}
