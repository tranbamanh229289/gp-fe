import { JsonSchemaValidator } from "@0xpolygonid/js-sdk";
import {
    getDocumentLoader,
    Merklizer,
    Path,
} from "@iden3/js-jsonld-merklization";

export class SchemaService {
    private contextURL: string;
    private schemaURL: string;
    constructor(contextURL: string, schemaURL: string) {
        this.contextURL = contextURL;
        this.schemaURL = schemaURL;
    }
}

export const createSchemaService = (contextURL: string, schemaURL: string) => {
    return new SchemaService(contextURL, schemaURL);
};
