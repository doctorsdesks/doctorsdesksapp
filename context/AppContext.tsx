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
}

// Create the context with a default value (can be null)
const AppContext = createContext<AppContextType | null>(null);

// Define the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ signUpHeaderData, setSignUpHeaderData ] = React.useState(signUpHeaderDataInitial);

  const [signUpDetails, setSignUpDetails] = React.useState(signUpDetailsInitial);

  const [doctorDetails, setDoctorDetails] = React.useState({});

  // const [user, setUser] = useState({ name: 'John', age: 30 });

  // const logout = () => {
  //   setUser({ name: '', age: 0 });
  // };

  return (
    <AppContext.Provider value={{ setSignUpHeaderData, signUpHeaderData, signUpDetails, setSignUpDetails, doctorDetails, setDoctorDetails  }}>
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
