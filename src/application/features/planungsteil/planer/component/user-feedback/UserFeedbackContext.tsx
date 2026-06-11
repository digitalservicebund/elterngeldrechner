import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type UserFeedbackContextType = {
  isFeedbackSubmitted: boolean;
  submitFeedback: () => void;
};

const UserFeedbackContext = createContext<UserFeedbackContextType | null>(null);

export function UserFeedbackProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  function submitFeedback() {
    setIsFeedbackSubmitted(true);
  }

  const value = useMemo(
    () => ({ isFeedbackSubmitted, submitFeedback }),
    [isFeedbackSubmitted],
  );

  return (
    <UserFeedbackContext.Provider value={value}>
      {children}
    </UserFeedbackContext.Provider>
  );
}

export function useUserFeedback(): UserFeedbackContextType {
  const context = useContext(UserFeedbackContext);
  if (!context)
    throw new Error("useUserFeedback must be used within UserFeedbackProvider");
  return context;
}
