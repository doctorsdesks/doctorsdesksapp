import { CardProps } from '@/constants/Enums';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { signUpDetailsInitial, signUpHeaderDataInitial } from './InitialState';
import { getSecureKey, saveSecureKey } from '@/components/Utils';

// Define the context type
interface AppContextType {
  signUpHeaderData: Array<{ label: string, status: string }>;
  setSignUpHeaderData: (finalData: Array<{ label: string, status: string}>) => void;
  signUpDetails: any;
  setSignUpDetails: (finalData: any) => void;
  doctorDetails: any;
  setDoctorDetails: (data: any) => void;
  translations: any;
  setTranslations: (data: any) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  dfo: { [key: string]: any };
  setDfo: (data: any) => void;
}

// Create the context with a default value (can be null)
const AppContext = createContext<AppContextType | null>(null);

// Define the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [signUpHeaderData, setSignUpHeaderData] = React.useState(signUpHeaderDataInitial);
  const [signUpDetails, setSignUpDetails] = React.useState(signUpDetailsInitial);
  const [doctorDetails, setDoctorDetails] = React.useState({});
  const [translations, setTranslations] = React.useState<any>({});
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [dfo, setDfo] = useState<any>({});

  useEffect(() => {
    // Load saved language preference on app start
    const loadLanguage = async () => {
      try {
        const savedLanguage = await getSecureKey("language");
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
        } else {
          // Set default language if none is saved
          setSelectedLanguage("English");
        }
      } catch (error) {
        console.error("Error loading language:", error);
        // Set default language on error
        setSelectedLanguage("English");
      }
    };
    loadLanguage();
  }, []);

  // Update stored language whenever it changes
  useEffect(() => {
    const updateLanguage = async () => {
      try {
        if (selectedLanguage) {
          await saveSecureKey("language", selectedLanguage);
        }
      } catch (error) {
        console.error("Error saving language:", error);
      }
    };
    updateLanguage();
  }, [selectedLanguage]);

  return (
    <AppContext.Provider value={{ 
        setSignUpHeaderData,
        signUpHeaderData,
        signUpDetails,
        setSignUpDetails,
        doctorDetails,
        setDoctorDetails,
        translations,
        setTranslations,
        selectedLanguage,
        setSelectedLanguage,
        dfo,
        setDfo
      }}>
      {children}
    </AppContext.Provider>
  );
};

// Create a custom hook for easier usage
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
