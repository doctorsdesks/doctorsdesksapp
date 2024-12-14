import { CardProps } from '@/constants/Enums';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { signUpDetailsInitial, signUpHeaderDataInitial } from './InitialState';

// Define the context type
interface AppContextType {
  signUpHeaderData: Array<{ label: string, status: string }>;
  setSignUpHeaderData: (finalData: Array<{ label: string, status: string}>) => void;
  signUpDetails: any;
  setSignUpDetails: (finalData: any) => void;
  doctorDetails: any;
  setDoctorDetails: (data: any) => void;
  clinicTimings: string;
  setClinicTimings: (data: any) => void;
  slotDuration: string;
  setSlotDuration: (data: string) => void;
  translations: any;
  setTranslations: (data: any) => void;
}

// Create the context with a default value (can be null)
const AppContext = createContext<AppContextType | null>(null);

// Define the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ signUpHeaderData, setSignUpHeaderData ] = React.useState(signUpHeaderDataInitial);
  const [signUpDetails, setSignUpDetails] = React.useState(signUpDetailsInitial);
  const [doctorDetails, setDoctorDetails] = React.useState({});
  const [clinicTimings, setClinicTimings] = React.useState("");
  const [slotDuration, setSlotDuration] = React.useState<string>("");
  const [translations, setTranslations] = React.useState<any>({});

  // const [user, setUser] = useState({ name: 'John', age: 30 });

  // const logout = () => {
  //   setUser({ name: '', age: 0 });
  // };

  return (
    <AppContext.Provider 
      value={{ 
          setSignUpHeaderData,
          signUpHeaderData,
          signUpDetails,
          setSignUpDetails,
          doctorDetails,
          setDoctorDetails,
          clinicTimings,
          setClinicTimings,
          slotDuration,
          setSlotDuration,
          translations,
          setTranslations
        }}
      >
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
