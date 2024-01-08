const { calculateDuration } = require("../src/index");

describe("calculateDuration", () => {
  test("calculates the correct duration between two times", () => {
    expect(calculateDuration("09:00:00", "09:01:00")).toBe(60); // 1 minute = 60 seconds
    expect(calculateDuration("09:00:00", "10:00:00")).toBe(3600); // 1 hour = 3600 seconds
  });

  test("calculates correct duration with minutes and seconds", () => {
    expect(calculateDuration("09:01:15", "09:02:45")).toBe(90); // 1 minute and 30 seconds = 90 seconds
  });

  test("calculates zero duration when times are the same", () => {
    expect(calculateDuration("09:00:00", "09:00:00")).toBe(0); // No duration
  });
});
