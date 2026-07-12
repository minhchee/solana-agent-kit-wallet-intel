import type { SolanaAgentKit } from "solana-agent-kit";
import { z } from "zod";
import labels from "./labels.json";

export interface WalletIntel {
  address: string;
  label: string | null;
  category: string | null;
  risk_note: string | null;
  known: boolean;
}

const labelMap = labels as Record<string, { label: string; category: string; risk_note: string | null }>;

export function identify(address: string): WalletIntel {
  const entry = labelMap[address];
  if (entry) {
    return {
      address,
      label: entry.label,
      category: entry.category,
      risk_note: entry.risk_note,
      known: true,
    };
  }
  return {
    address,
    label: null,
    category: null,
    risk_note: null,
    known: false,
  };
}

const WalletIntelPlugin = {
  name: "wallet-intel",
  init(agent: SolanaAgentKit) {
    agent.methods.getWalletIntel = async (
      _agent: SolanaAgentKit,
      address: string,
    ): Promise<WalletIntel> => {
      return identify(address);
    };

    agent.actions.push({
      name: "get_wallet_intel",
      similes: [
        "identify solana address",
        "what is this address",
        "label a wallet",
        "check address type",
        "recognize this program",
      ],
      description:
        "Identify a Solana address or program ID and return its known label, category, and a risk note. Use this as a pre-interaction safety check before sending funds or calling a contract.",
      examples: [
        {
          input: { address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZj4pU6THgJGD" },
          output: {
            status: "success",
            data: { label: "Jupiter Aggregator v6", category: "Swap", known: true },
          },
          explanation: "Returns the protocol behind a known program ID.",
        },
        {
          input: { address: "UnknownAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
          output: { status: "unknown", data: { label: null, known: false } },
          explanation: "Returns unknown when the address is not in the seed library.",
        },
      ],
      schema: z.object({ address: z.string().min(32).max(44) }),
      handler: async (_agent: SolanaAgentKit, params: { address: string }) => {
        const result = identify(params.address);
        return {
          status: result.known ? "success" : "unknown",
          data: result,
        };
      },
    });
  },
};

export default WalletIntelPlugin;
