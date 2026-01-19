import { derivePublicKey } from "@zk-kit/eddsa-poseidon";

const privKeyHex =
    "d7a6adabab430f6579551a00890bde642c140e0a56cd636da8fbdd7d300bac8b";
const privateKey = Buffer.from(privKeyHex, "hex");
const publicKey = derivePublicKey(privateKey);

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("PUBLIC KEY (@zk-kit)");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("X:", publicKey[0].toString());
console.log("Y:", publicKey[1].toString());
console.log("");
console.log("Circuit expects:");
console.log(
    "X:",
    "14711378731147137126522643897782763984084091126590085998198320312637711634793",
);
console.log(
    "Y:",
    "19823006119965726360548869695685374258631040583519209251753181890472270304247",
);
console.log("");
console.log(
    "Match X:",
    publicKey[0].toString() ===
        "14711378731147137126522643897782763984084091126590085998198320312637711634793",
);
console.log(
    "Match Y:",
    publicKey[1].toString() ===
        "19823006119965726360548869695685374258631040583519209251753181890472270304247",
);
