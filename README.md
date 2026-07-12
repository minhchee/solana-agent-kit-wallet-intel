# @solana-agent-kit/plugin-wallet-intel

A read-only Solana address and program identifier plugin for the [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit).

## What it does

The plugin adds a `get_wallet_intel` action that maps a Solana address or program ID to a known label, a category, and a short risk note. It is designed as a **pre-interaction safety check** so an agent can recognize what a counterparty or contract actually is before it sends funds or calls a program.

Existing official plugins (token, nft, defi, misc, blinks) focus on *doing* things on chain. This plugin focuses on *knowing* what an address is. That gap is what makes it useful: an agent that trades, transfers, or approves should first verify the other side.

## Why it is useful

- Risk awareness: an agent can refuse or pause when a target is a contract it does not recognize.
- Explainability: human reviewers get a plain-language label and category for any address the agent touches.
- Extensible: the seed library is a single JSON file. Adding coverage is one entry, no code change.

## Install

```
npm install @solana-agent-kit/plugin-wallet-intel
```

## Usage

```ts
import { SolanaAgentKit } from "solana-agent-kit";
import WalletIntelPlugin from "@solana-agent-kit/plugin-wallet-intel";

const agent = new SolanaAgentKit(wallet, rpcUrl, config).use(WalletIntelPlugin);

const intel = await agent.methods.getWalletIntel(
  agent,
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZj4pU6THgJGD",
);

console.log(intel);
// { address, label: "Jupiter Aggregator v6", category: "Swap", known: true, ... }
```

The action is also exposed to LangChain / Vercel AI SDK / OpenAI through the kit's standard `create*Tools(agent, agent.actions)` adapters, so no extra wiring is needed.

## Architecture compliance

- Default-exported plugin object with an `init(agent)` that runs on `.use()`.
- Methods are injected onto `agent.methods`.
- Metadata is registered on `agent.actions` with `name`, `similes`, `description`, `examples`, a Zod `schema`, and a `handler`.
- Return shape follows the kit convention: `{ status, data }`.

## Test

```
npm test
```

A standalone demo that needs no `solana-agent-kit` is included:

```
node examples/demo.mjs
```

## Extend the seed library

Edit `src/labels.json`. Each entry is:

```json
"PROGRAM_ID": {
  "label": "Human readable name",
  "category": "Core | Swap | NFT | DeFi | Stake | Multisig",
  "risk_note": "Optional guidance for the agent"
}
```

## License

MIT
