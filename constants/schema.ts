import { DocumentType } from "./document";

export enum SchemaStatus {
    Active = "active",
    Revoked = "revoked",
}

export enum Slot {
    SlotIndexA = "slotIndexA",
    SlotIndexB = "slotIndexB",
    SlotDataA = "slotDataA",
    SlotDataB = "slotDataB",
}

export const attributesTypes = [
    "string",
    "integer",
    "number",
    "date",
    "boolean",
];

export interface SchemaTypeField {
    name: string;
    type: string;
}

export const documentSchemaTypeFields: Record<DocumentType, SchemaTypeField[]> =
    {
        [DocumentType.CitizenIdentity]: [
            {
                name: "firstName",
                type: "string",
            },
            {
                name: "lastName",
                type: "string",
            },

            {
                name: "dateOfBirth",
                type: "dateTime",
            },

            {
                name: "placeOfBirth",
                type: "string",
            },

            {
                name: "gender",
                type: "string",
            },
            {
                name: "status",
                type: "string",
            },

            {
                name: "issueDate",
                type: "dateTime",
            },
            {
                name: "expiryDate",
                type: "dateTime",
            },
        ],
        [DocumentType.DriverLicense]: [
            {
                name: "class",
                type: "string",
            },
            {
                name: "point",
                type: "integer",
            },

            {
                name: "issueDate",
                type: "dateTime",
            },
            {
                name: "expiryDate",
                type: "dateTime",
            },
        ],

        [DocumentType.AcademicDegree]: [
            {
                name: "degreeType",
                type: "string",
            },
            { name: "major", type: "string" },
            {
                name: "university",
                type: "string",
            },
            { name: "gpa", type: "float" },
            {
                name: "graduateYear",
                type: "integer",
            },
            {
                name: "classification",
                type: "string",
            },
        ],

        [DocumentType.HealthInsurance]: [
            {
                name: "insuranceType",
                type: "string",
            },
            {
                name: "hospital",
                type: "string",
            },

            {
                name: "startDate",
                type: "dateTime",
            },
            {
                name: "expiryDate",
                type: "dateTime",
            },
        ],
        [DocumentType.Passport]: [
            {
                name: "passportType",
                type: "string",
            },
            {
                name: "nationality",
                type: "string",
            },
            { name: "mrz", type: "string" },

            {
                name: "issueDate",
                type: "dateTime",
            },
            {
                name: "expiryDate",
                type: "dateTime",
            },
        ],
    };
