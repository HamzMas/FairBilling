const { isValidLine } = require("../src/index");

describe("isValidLine", () => {
  test("returns true for valid log line format", () => {
    expect(isValidLine("09:00:00 UserA Start")).toBe(true);
    expect(isValidLine("09:00:00 UserA End")).toBe(true);
  });

  test("returns false for invalid log line format", () => {
    expect(isValidLine("invalid input")).toBe(false); // Completely invalid input
    expect(isValidLine("UserA Start 09:00:00")).toBe(false); // Incorrect order
    expect(isValidLine("09:00:00UserA Start")).toBe(false); // Missing space
    expect(isValidLine("09:00:00 UserA Begin")).toBe(false); // Invalid event
    expect(isValidLine("09:00 UserA Start")).toBe(false); // Invalid time format
    expect(isValidLine("25:00:00 UserA Start")).toBe(false); // Invalid hour
    expect(isValidLine("09:60:00 UserA Start")).toBe(false); // Invalid minute
    expect(isValidLine("09:00:60 UserA Start")).toBe(false); // Invalid second
  });
});
