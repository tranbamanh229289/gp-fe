import { VerifiableConstants } from "@0xpolygonid/js-sdk";
import {
    DocumentLoader,
    getDocumentLoader,
    Options,
} from "@iden3/js-jsonld-merklization";

const CACHED_CONTEXTS: Record<string, string> = {
    [VerifiableConstants.JSONLD_SCHEMA.W3C_CREDENTIAL_2018]:
        VerifiableConstants.JSONLD_SCHEMA.W3C_VC_DOCUMENT_2018,

    [VerifiableConstants.JSONLD_SCHEMA.IDEN3_CREDENTIAL]:
        VerifiableConstants.JSONLD_SCHEMA.IDEN3_PROOFS_DEFINITION_DOCUMENT,
};

export const getCachedDocumentLoader = async (url: string) => {
    const cached = CACHED_CONTEXTS[url];
    let document;

    if (cached) {
        document = typeof cached === "string" ? JSON.parse(cached) : cached;
    } else {
        const res = await fetch(url);
        document = await res.json();
    }

    return {
        contextUrl: null,
        document: document,
        documentUrl: url,
    };
};

export const cacheLoader = (opts?: Options): DocumentLoader => {
    const doc = JSON.parse(
        VerifiableConstants.JSONLD_SCHEMA.W3C_VC_DOCUMENT_2018
    );
    const cache = new Map<string, any>();
    cache.set(VerifiableConstants.JSONLD_SCHEMA.W3C_CREDENTIAL_2018, {
        document: doc,
        documentUrl: VerifiableConstants.JSONLD_SCHEMA.W3C_CREDENTIAL_2018,
    });

    return async (url: string) => {
        let remoteDoc = cache.get(url);
        if (remoteDoc) {
            return remoteDoc;
        }
        remoteDoc = await getDocumentLoader(opts)(url);
        cache.set(url, remoteDoc);
        return remoteDoc;
    };
};
