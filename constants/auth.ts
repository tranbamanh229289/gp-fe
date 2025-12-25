export enum AuthMode {
    Login = "login",
    Register = "register",
}
export enum AuthRole {
    Holder = "holder",
    Issuer = "issuer",
    Verifier = "verifier",
}
export enum RegisterStep {
    role = "role",
    wallet = "wallet",
    identity = "identity",
}
export enum LoginStep {
    challenge = "challenge",
    proof = "proof",
    verify = "verify",
}
