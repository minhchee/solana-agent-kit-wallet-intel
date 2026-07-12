import { describe, it, expect } from "vitest";
import { identify } from "../src/index";

describe("wallet-intel identify", () => {
  it("identifies a known program ID", () => {
    const r = identify("JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZj4pU6THgJGD");
    expect(r.known).toBe(true);
    expect(r.label).toBe("Jupiter Aggregator v6");
    expect(r.category).toBe("Swap");
    expect(r.risk_note).toContain("aggregator");
  });

  it("identifies the SPL Token program", () => {
    const r = identify("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5");
    expect(r.known).toBe(true);
    expect(r.category).toBe("Core");
  });

  it("returns unknown for an unlisted address", () => {
    const r = identify("UnknownAddressXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    expect(r.known).toBe(false);
    expect(r.label).toBeNull();
    expect(r.category).toBeNull();
  });
});
