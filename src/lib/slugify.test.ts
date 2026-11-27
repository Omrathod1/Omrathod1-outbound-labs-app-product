import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lower-cases and joins words", () => expect(slugify("Kestrel Supply Co.")).toBe("kestrel-supply-co"));
  it("strips accents", () => expect(slugify("Győr Kávé")).toBe("gyor-kave"));
  it("returns empty for symbols only", () => expect(slugify("!!!")).toBe(""));
});
