// Standalone demo of the wallet-intel core logic.
// Runs without solana-agent-kit so the logic can be verified directly with Node.
import { readFileSync } from "node:fs";

const labels = JSON.parse(
  readFileSync(new URL("../src/labels.json", import.meta.url), "utf8"),
);

function identify(address) {
  const entry = labels[address];
  if (entry) {
    return { address, ...entry, known: true };
  }
  return { address, label: null, category: null, risk_note: null, known: false };
}

const samples = [
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZj4pU6THgJGD", // Jupiter v6
  "11111111111111111111111111111111", // System Program
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5", // SPL Token
  "dRiftyHA39MWEi3m9aunc5MzRF1JYuJAEKOpUhjhRv", // Drift
  "UnknownAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // not in library
];

console.log("Wallet-Intel demo (seed library: " + Object.keys(labels).length + " entries)\n");
for (const addr of samples) {
  console.log(addr);
  console.log("  => " + JSON.stringify(identify(addr)));
}
