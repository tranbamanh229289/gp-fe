import { SchemaStatus, Slot } from "@/constants/schema";

export interface Schema {
    id: string;
    issuerDID: string;
    hash: string;
    title: string;
    type: string;
    version: string;
    description: string;
    status: SchemaStatus;
    isMerklized: boolean;
    schemaURL: string;
    contextURL: string;
    attributes: Attribute[];
}

export interface Attribute {
    name: string;
    title: string;
    type: string;
    description: string;
    required: boolean;
    slot: Slot;
}
