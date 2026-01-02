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
    Issued = "issued",
}

export enum IssuerNullType {
    Null = "null",
}

export type IssuerItemSelectedType = DocumentType | IssuerNullType;
