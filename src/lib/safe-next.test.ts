import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it("keeps a local path", () => expect(safeNext("/app/campaigns")).toBe("/app/campaigns"));
  it("falls back when empty", () => expect(safeNext(null)).toBe("/app"));
  it("blocks another origin", () => expect(safeNext("https://evil.example")).toBe("/app"));
  it("blocks protocol-relative URLs", () => expect(safeNext("//evil.example")).toBe("/app"));
  it("blocks backslash tricks", () => expect(safeNext("/\\evil.example")).toBe("/app"));
});
