export const InputType = {
    "PHONE": "PHONE",
    "NUMBER": "NUMBER",
    "TEXT": "TEXT",
    "DATE": "DATE",
    "AMOUNT": "AMOUNT"
};

export interface CardProps {
    id: string;
    label: string;
    documentType: string;
    value: string;
    isUploaded: boolean;
    docIcon?: any;
    frontUrl: string;
    backUrl: string;
}

export interface StringObject {
    id: string;
    type: string;
    inputType: string;
    value: string;
    label: string;
    isMandatory?: boolean;
    errorMessage?: string;
    placeholder?: string;
    options?: Array<string>;
    isDisabled?: boolean;
}

export const AppointmentStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
}

export const AppointmentType = {
    OPD: "OPD",
    EMERGENCY: 'EMERGENCY'
}

export const DocStatusType = {
    NOT_VERIFIED: "NOT_VERIFIED",
    VERIFIED: "VERIFIED",
    BLOCKED: "BLOCKED"
}

export interface DaysForSlot {
    day: string;
    label: string;
    isSelected: boolean;
    timings: { [key: string]: string; }[]
}

export interface PatientListProps {
    name: string;
    age: string;
    phone: string;
}

export const CONFIGS = {
    SPECIALISATION: "SPECIALISATION"
}