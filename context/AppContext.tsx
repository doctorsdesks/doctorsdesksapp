import { CardProps } from '@/constants/Enums';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context type
interface AppContextType {
  signUpHeaderData: Array<{ label: string, status: string }>;
  setSignUpHeaderData: (finalData: Array<{ label: string, status: string}>) => void;
  signUpDetails: any;
  setSignUpDetails: (finalData: any) => void;

  // user: { name: string; age: number };
  // setUser: (user: { name: string; age: number }) => void;
  // logout: () => void;
}

// Create the context with a default value (can be null)
const AppContext = createContext<AppContextType | null>(null);

// Define the provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ signUpHeaderData, setSignUpHeaderData ] = React.useState([
    {
        label: "Personal Details",
        status: "STARTED",
    },
    {
        label: "Clinic Details",
        status: "NOT_STARTED",
    },
    {
        label: "ID Proof",
        status: "NOT_STARTED",
    }
  ]);

  const [signUpDetails, setSignUpDetails] = React.useState({
    phoneOTPDetails: {
      phoneNumber: "",
      otp: "",
    },
    imageUrl: "",
    personalDetails: [
      {
          id: "fullName",
          type: "STRING",
          inputType: "TEXT",
          value: "",
          label: "Full Name",
          isMandatory: true,
          errorMessage: "Please provide your full name.",
          placeholder: "Enter your full name",
      },
      {
          id: "gender",
          type: "STRING",
          inputType: "RADIO",
          value: "",
          label: "Gender",
          isMandatory: true,
          errorMessage: "Please select your gender",
          options: ["MALE", "FEMALE", "OTHER"],
      },
      {
        id: "email",
        type: "STRING",
        inputType: "EMAIL",
        value: "",
        label: "Email",
        isMandatory: true,
        errorMessage: "Please enter a valid email Id",
      },
      {
          id: "experience",
          type: "STRING",
          inputType: "NUMBER",
          value: "",
          label: "Experience (in years)",
          isMandatory: true,
          errorMessage: "Please provide your experience",
          placeholder: "Enter your experience in years",
      },
      {
          id: "specialisation",
          type: "STRING",
          inputType: "TEXT",
          value: "",
          label: "Specialisation",
          isMandatory: true,
          errorMessage: "Please provide your specialisation",
          placeholder: "Enter your specialisation",
      },
      {
          id: "qualification",
          type: "STRING",
          inputType: "TEXT",
          value: "",
          label: "Qualification",
          isMandatory: true,
          errorMessage: "Please provide your qualification",
          placeholder: "Enter your qualification",
      },
      {
        id: "languages",
        type: "STRING",
        inputType: "BOXES",
        value: [],
        label: "Languages",
        isMandatory: true,
        errorMessage: "Please select atleast 1 language",
        placeholder: "Select maximum 3 languages",
      }
    ],
    clinicDetails: [
      {
          id: "clinicName",
          type: "STRING",
          inputType: "TEXT",
          value: "",
          label: "Clinic Name",
          isMandatory: true,
          errorMessage: "Please enter your clinic name",
          placeholder: "Clinic Name",
      },
      {
          id: "clinicAddress",
          type: "STRING",
          inputType: "TEXT",
          value: "",
          label: "Clinic Address",
          isMandatory: true,
          errorMessage: "Please enter your clinic address",
          placeholder: "12, Street Name",
      },
      {
          id: "landmark",
          type: "STRING",
          inputType: "TEXT",
          value: "",
          label: "Landmark",
          isMandatory: false,
          errorMessage: "",
          placeholder: "Near Ganesh Temple",
      },
      {
          id: "city",
          type: "STRING",
          inputType: "TEXT",
          value: "",
          label: "City",
          isMandatory: true,
          errorMessage: "Please enter your city",
          placeholder: "Ambala",
      },
      {
        id: "state",
        type: "STRING",
        inputType: "TEXT",
        value: "",
        label: "State",
        isMandatory: true,
        errorMessage: "Please enter your state",
        placeholder: "Haryana",
    },
      {
          id: "pincode",
          type: "STRING",
          inputType: "NUMBER",
          value: "",
          label: "Pincode",
          isMandatory: true,
          errorMessage: "Please enter your pincode",
          placeholder: "133001",
      },
    ],
    idProofDetails: [
      {
          id: "registration",
          label: "Registration Card",
          documentType: "REGISTRATION",
          isUploaded: false,
          value: "",
          frontUrl: "",
          backUrl: "",
          docIcon: require('../assets/images/registration.png'),
      },
      {
          id: "aadharCard",
          label: "Aadhar Card",
          documentType: "AADHAR",
          isUploaded: false,
          value: "",
          frontUrl: "",
          backUrl: "",
          docIcon: require('../assets/images/address.png'),
      },
      {
          id: "panCard",
          label: "Pan Card",
          documentType: "PAN",
          isUploaded: false,
          value: "",
          frontUrl: "",
          backUrl: "",
          docIcon: require('../assets/images/address.png'),
      }
    ]
  });

  // const [user, setUser] = useState({ name: 'John', age: 30 });

  // const logout = () => {
  //   setUser({ name: '', age: 0 });
  // };

  return (
    <AppContext.Provider value={{ setSignUpHeaderData, signUpHeaderData, signUpDetails, setSignUpDetails  }}>
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
