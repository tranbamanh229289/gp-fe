import {
    Award,
    Car,
    Clock,
    FileText,
    Fingerprint,
    GraduationCap,
    Heart,
    Plane,
    Settings,
    Shield,
} from "lucide-react";
import { DocumentType } from "./document";

export enum IssuerActiveTab {
    Overview = "overview",
    Documents = "documents",
    Schemas = "schemas",
    CredentialRequest = "credential_requests",
    VerifiableCredential = "verifiable_credentials",
}

export enum IssuerModal {
    Null = "null",

    // document
    CreateDocument = "create_document",
    EditDocument = "edit_document",
    DeleteDocument = "delete_document",

    // schema
    CreateSchema = "create_schema",
    DeleteSchema = "delete_schema",
    DetailSchema = "detail_schema",

    // credential
    IssueVerifiableCredential = "issue_verifiable_credential",
    RejectCredentialRequest = "reject_credential_request",
    ReviewCredentialRequest = "review_credential_request",

    // verifiable
    VerifiableCredentialDetail = "verifiable_credential_detail",
}

export enum IssuerNullType {
    Null = "null",
}

export type IssuerItemSelectedType = DocumentType | IssuerNullType;

//
export const documentTypes: DocumentType[] = [
    DocumentType.CitizenIdentity,
    DocumentType.AcademicDegree,
    DocumentType.HealthInsurance,
    DocumentType.DriverLicense,
    DocumentType.Passport,
];

export const credentialTypeConfig = {
    [DocumentType.CitizenIdentity]: {
        icon: Fingerprint,
        label: "Citizen Identity",
        color: "blue",
        gradient: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
        ringColor: "ring-blue-500",
    },
    [DocumentType.AcademicDegree]: {
        icon: GraduationCap,
        label: "Academic Degree",
        color: "purple",
        gradient: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
        ringColor: "ring-purple-500",
    },
    [DocumentType.HealthInsurance]: {
        icon: Heart,
        label: "Health Insurance",
        color: "rose",
        gradient: "from-rose-500 to-orange-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        textColor: "text-red-700",
        ringColor: "ring-red-500",
    },
    [DocumentType.DriverLicense]: {
        icon: Car,
        label: "Driver License",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-700",
        ringColor: "ring-green-500",
    },
    [DocumentType.Passport]: {
        icon: Plane,
        label: "Passport",
        color: "amber",
        gradient: "from-amber-500 to-yellow-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
        ringColor: "ring-orange-500",
    },
};

export const navigationItems = [
    {
        id: "overview",
        tab: IssuerActiveTab.Overview,
        label: "Overview",
        icon: Shield,
    },
    {
        id: "documents",
        tab: IssuerActiveTab.Documents,
        label: "Documents",
        icon: FileText,
    },
    {
        id: "schemas",
        tab: IssuerActiveTab.Schemas,
        label: "Schemas",
        icon: Settings,
    },
    {
        id: "credential_offer",
        tab: IssuerActiveTab.CredentialRequest,
        label: "Credential Request",
        icon: Clock,
        // badge: 1,
    },
    {
        id: "verifiable_credential",
        tab: IssuerActiveTab.VerifiableCredential,
        label: "Verifiable Credential",
        icon: Award,
    },
];
