import { CredentialRequest } from "@/types/credential_request";
import { Claim, DID } from "@iden3/js-iden3-core";
import {
    W3CCredential,
    CredentialRequest as SDKCredentialRequest,
    JsonDocumentObject,
    CredentialStatusType,
    CoreClaimCreationOptions,
    cacheLoader,
    SubjectPosition,
    MerklizedRootPosition,
} from "@0xpolygonid/js-sdk";
import { randomIntSecure } from "@/helper/randomBit";
import path from "path";

export class CredentialService {
    private credentialRequest: CredentialRequest;

    constructor(credentialRequest: CredentialRequest) {
        this.credentialRequest = credentialRequest;
    }
    createVerifiableCredential(
        credentialData: Record<string, any>,
    ): W3CCredential {
        const issuer: DID = DID.parse(this.credentialRequest.issuerDID);

        const credentialSubject: JsonDocumentObject = {
            id: this.credentialRequest.holderDID,
            ...credentialData,
        };

        const sdkCredentialRequest: SDKCredentialRequest = {
            id: "urn:uuid:" + crypto.randomUUID(),
            credentialSchema: this.credentialRequest.schemaURL,
            type: this.credentialRequest.schemaType,
            credentialSubject: credentialSubject,
            context: [this.credentialRequest.contextURL],
            expiration: this.credentialRequest.expiration,
            issuanceDate: Date.now() / 1000,
            revocationOpts: {
                id: path.join(
                    process.env.NEXT_PUBLIC_BASE_URL ??
                        "http://localhost:8080/api/v1",
                    "revocation",
                ),
                type: CredentialStatusType.SparseMerkleTreeProof,
                nonce: randomIntSecure(2 ** 32),
            },
        };

        const vc = W3CCredential.fromCredentialRequest(
            issuer,
            sdkCredentialRequest,
        );
        return vc;
    }

    async createCoreClaim(
        vc: W3CCredential,
        isMerklized: boolean,
    ): Promise<Claim> {
        let options: CoreClaimCreationOptions = {
            revNonce: vc.credentialStatus.revocationNonce as number,
            version: 0,
            subjectPosition: SubjectPosition.Index,
            merklizedRootPosition: MerklizedRootPosition.None,
            updatable: false,
            merklizeOpts: { documentLoader: cacheLoader() },
        };
        if (isMerklized) {
            options = {
                ...options,
                merklizedRootPosition: MerklizedRootPosition.Index,
            };
        }
        const coreClaim = await vc.toCoreClaim(options);
        console.log(coreClaim);

        return coreClaim;
    }
}

export const createCredentialService = (
    credentialRequest: CredentialRequest,
) => {
    return new CredentialService(credentialRequest);
};
