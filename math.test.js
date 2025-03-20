import { add } from "./math";

describe("Math functions", () => {
  test("adds two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });
});
