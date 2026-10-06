import { describe, expect, it } from "vitest";
import { amountDraftToCents, appendAmountKey } from "./amount";

describe("amount entry", () => {
  it("turns a decimal euro draft into integer cents", () => {
    expect(amountDraftToCents("25.50")).toBe(2550);
    expect(amountDraftToCents("3.6")).toBe(360);
  });

  it("rejects zero, excess precision, and amounts above the preview limit", () => {
    expect(amountDraftToCents("0.00")).toBeNull();
    expect(amountDraftToCents("1.001")).toBeNull();
    expect(amountDraftToCents("10000")).toBeNull();
  });

  it("limits keypad entry to four whole digits and two decimal digits", () => {
    expect(appendAmountKey("9999", "9")).toBe("9999");
    expect(appendAmountKey("25.50", "1")).toBe("25.50");
    expect(appendAmountKey("25", ".")).toBe("25.");
    expect(appendAmountKey("25.5", "backspace")).toBe("25.");
  });
});
