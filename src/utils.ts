export function hexToString(hex: string): string {
  return Buffer.from(hex.slice(2), "hex").toString("utf-8");
}

export function stringToHex(str: string): string {
  return "0x" + Buffer.from(str, "utf-8").toString("hex");
}
