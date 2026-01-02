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
    Role = "role",
    Wallet = "wallet",
    Identity = "identity",
}
export enum LoginStep {
    Challenge = "challenge",
    Generate = "generate",
    Verify = "verify",
    Login = "login",
}
