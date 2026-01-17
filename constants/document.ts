export enum DocumentType {
    CitizenIdentity = "citizen_identity",
    AcademicDegree = "academic_degree",
    HealthInsurance = "health_insurance",
    DriverLicense = "driver_license",
    Passport = "passport",
}

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export enum DocumentStatus {
    Active = "active",
    Revoked = "revoked",
    Expired = "expired",
}

export enum DegreeType {
    Bachelor = "bachelor",
    Master = "master",
    PhD = "phd",
    AssociateProfessor = "associate professor",
    FullProfessor = "full professor",
}

export enum DegreeClassification {
    Excellent = "excellent",
    VeryGood = "very good",
    Good = "good",
    Average = "average",
    Pass = "pass",
}

export enum PassportType {
    Ordinary = "ordinary",
    Diplomatic = "diplomatic",
    Official = "official",
}

export interface DocumentField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    max?: number;
    min?: number;
    options?: string[];
}

export const documentTypeFields: Record<DocumentType, DocumentField[]> = {
    [DocumentType.CitizenIdentity]: [
        {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
        },
        {
            name: "lastName",
            label: "Last Name",
            type: "text",
            required: true,
        },

        {
            name: "dateOfBirth",
            label: "Date of Birth",
            type: "date",
            required: true,
        },

        {
            name: "placeOfBirth",
            label: "Place of Birth",
            type: "text",
            required: true,
        },

        {
            name: "gender",
            label: "Gender",
            type: "select",
            options: Object.values(Gender),
            required: true,
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            options: Object.values(DocumentStatus),
            required: true,
        },

        {
            name: "issueDate",
            label: "Issue Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],
    [DocumentType.DriverLicense]: [
        {
            name: "class",
            label: "License Class",
            type: "text",
            required: true,
        },
        {
            name: "point",
            label: "Points",
            type: "number",
            max: 10,
            min: 0,
            required: true,
        },

        {
            name: "issueDate",
            label: "Issue Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],

    [DocumentType.AcademicDegree]: [
        {
            name: "degreeType",
            label: "Degree Type",
            type: "select",
            options: Object.values(DegreeType),
            required: true,
        },
        { name: "major", label: "Major", type: "text", required: true },
        {
            name: "university",
            label: "University",
            type: "text",
            required: true,
        },
        { name: "gpa", label: "GPA", type: "number", required: true },
        {
            name: "graduateYear",
            label: "Graduate Year",
            type: "number",
            required: true,
        },
        {
            name: "classification",
            label: "Classification",
            type: "select",
            options: Object.values(DegreeClassification),
            required: true,
        },
    ],

    [DocumentType.HealthInsurance]: [
        {
            name: "insuranceType",
            label: "Insurance Type",
            type: "text",
            required: true,
        },
        {
            name: "hospital",
            label: "Hospital",
            type: "text",
            required: true,
        },

        {
            name: "startDate",
            label: "Start Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],
    [DocumentType.Passport]: [
        {
            name: "passportType",
            label: "Passport Type",
            type: "select",
            options: Object.values(PassportType),
            required: true,
        },
        {
            name: "nationality",
            label: "Nationality",
            type: "text",
            required: true,
        },
        { name: "mrz", label: "MRZ", type: "text", required: true },

        {
            name: "issueDate",
            label: "Issue Date",
            type: "date",
            required: true,
        },
        {
            name: "expiryDate",
            label: "Expire Date",
            type: "date",
            required: true,
        },
    ],
};
