import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your translation context
interface TranslationContextType {
  t: (value: string) => string;
  setTranslations: (data: Translations) => void;
}

interface Translations {
    [key: string]: string; // Key-value pairs for translations
  }

// Create the context with a default value
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Create a provider component
export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [translations, setTranslations] = useState<Translations>({});

  const t = (key: string) => translations[key] || key;

  return (
    <TranslationContext.Provider value={{ t, setTranslations }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
