import {
    DegreeClassification,
    DegreeType,
    DocumentStatus,
    DocumentType,
    Gender,
} from "@/constants/document";

export type DocumentTypeOption =
    | CitizenIdentity
    | AcademicDegree
    | HealthInsurance
    | DriverLicense
    | Passport;

export type DocumentData =
    | CitizenIdentity
    | AcademicDegree
    | HealthInsurance
    | DriverLicense
    | Passport;

export interface CitizenIdentity {
    id: string;
    idNumber: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    placeOfBirth: string;
    dateOfBirth: number;
    status: DocumentStatus;
    issueDate: number;
    expiryDate: number;
    holderDID: string;
    issuerDID: string;
}

export interface AcademicDegree {
    id: string;
    degreeNumber: string;
    degreeType: DegreeType;
    major: string;
    university: string;
    gpa: string;
    graduateYear: number;
    classification: DegreeClassification;
    status: DocumentStatus;
    issueDate: number;
    holderDID: string;
    issuerDID: string;
}

export interface HealthInsurance {
    id: string;
    insuranceNumber: string;
    insuranceType: string;
    hospital: string;
    status: DocumentStatus;
    startDate: number;
    expiryDate: number;
    holderDID: string;
    issuerDID: string;
}

export interface DriverLicense {
    id: string;
    driverNumber: string;
    class: string;
    point: number;
    status: DocumentStatus;
    issueDate: number;
    expiryDate: number;
    holderDID: string;
    issuerDID: string;
}

export interface Passport {
    id: string;
    passportNumber: string;
    passportType: string;
    nationality: string;
    mrz: string;
    status: DocumentStatus;
    issueDate: number;
    expiryDate: number;
    holderDID: string;
    issuerDID: string;
}
