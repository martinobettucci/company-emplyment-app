import React, { createContext, useContext, useState, ReactNode } from "react";

type NewsletterDraft = {
  subject: string;
  body: string;
};

type NewsletterContextType = {
  draft: NewsletterDraft | null;
  setDraft: (draft: NewsletterDraft) => void;
};

const NewsletterContext = createContext<NewsletterContextType | undefined>(undefined);

export function NewsletterProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<NewsletterDraft | null>(null);

  return (
    <NewsletterContext.Provider value={{ draft, setDraft }}>
      {children}
    </NewsletterContext.Provider>
  );
}

export function useNewsletter() {
  const ctx = useContext(NewsletterContext);
  if (!ctx) throw new Error("useNewsletter must be used within NewsletterProvider");
  return ctx;
}
