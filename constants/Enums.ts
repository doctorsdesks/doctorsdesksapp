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

export const RequestStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
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

export const DoctorRolesType = {
    PRIMARY_DOCTOR: "Primary Doctor",
    CONSULTANT: "Consultant",
    VISITING_DOCTOR: "Visiting Doctor",
    STAFF_DOCTOR: "Staff Doctor"
};

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

export enum NotificationCategory {
  GENERAL = 'GENERAL',
  APPOINTMENT_REQUEST = 'APPOINTMENT_REQUEST',
  APPOINTMENT_STATUS = 'APPOINTMENT_STATUS',
  DOCTOR_JOINING_REQUEST = 'DOCTOR_JOINING_REQUEST',
  DOCTOR_JOINING_STATUS = 'DOCTOR_JOINING_STATUS',
  HOSPITAL_ANNOUNCEMENT = 'HOSPITAL_ANNOUNCEMENT',
}

export enum NotificationActionCategory {
  NONE = "NONE",
  APPOINTMENT_REQUEST_ACTIONS = "APPOINTMENT_REQUEST_ACTIONS",
  DOCTOR_JOINING_REQUEST_ACTIONS = "DOCTOR_JOINING_REQUEST_ACTIONS",
}

export interface NotificationType {
    id: string;
    title: string;
    body: string;
    image: any;
    icon?: string;
    metadata: {
        notificationId: string;
        category: NotificationCategory;
        appointmentId: string;
        actionCategory?: NotificationActionCategory;
        deepLink?: string;
        mappingId?: string;
    },
    isRead: boolean;
    category: NotificationCategory;
}

export interface DoctorRequest {
    doctorCode: string;
    role: string;
}