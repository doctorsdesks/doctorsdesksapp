import { CardProps } from '@/constants/Enums';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface AppContextType {
  idProofData: Array<CardProps>;
  setIdProofData: (finalData: Array<CardProps>) => void;
  // user: { name: string; age: number };
  // setUser: (user: { name: string; age: number }) => void;
  // logout: () => void;
}

// Create the context with a default value (can be null)
const AppContext = createContext<AppContextType | null>(null);

// Define the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [idProofData, setIdProofData] = useState([
      {
          id: "registration",
          label: "Registration Card",
          isUploaded: false,
          value: "",
          url: "",
          docIcon: "",
      }
  ]);
  // const [user, setUser] = useState({ name: 'John', age: 30 });

  // const logout = () => {
  //   setUser({ name: '', age: 0 });
  // };

  return (
    <AppContext.Provider value={{ idProofData ,setIdProofData }}>
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
