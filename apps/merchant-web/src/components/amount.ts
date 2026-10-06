const MAX_AMOUNT_CENTS = 999_999;

export function appendAmountKey(current: string, key: string): string {
  if (key === "backspace") {
    return current.slice(0, -1);
  }

  if (key === ".") {
    if (current.includes(".")) {
      return current;
    }
    return current ? `${current}.` : "0.";
  }

  if (!/^\d$/.test(key)) {
    return current;
  }

  const [whole = "", fraction] = current.split(".");
  if (fraction !== undefined && fraction.length >= 2) {
    return current;
  }

  if (fraction === undefined && whole.length >= 4) {
    return current;
  }

  if (current === "0") {
    return key;
  }

  return `${current}${key}`;
}

export function amountDraftToCents(draft: string): number | null {
  if (!/^\d{1,4}(?:\.\d{0,2})?$/.test(draft)) {
    return null;
  }

  const [whole, fraction = ""] = draft.split(".");
  const cents = Number.parseInt(whole, 10) * 100 + Number.parseInt(fraction.padEnd(2, "0") || "0", 10);

  if (cents <= 0 || cents > MAX_AMOUNT_CENTS) {
    return null;
  }

  return cents;
}
