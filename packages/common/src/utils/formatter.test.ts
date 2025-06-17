import { capitalize } from "./formatter";

describe("formatter utils", () => {
  it("should capitalize the first letter of a word", () => {
    const input = "hello";
    const result = capitalize(input);
    expect(result).toBe("Hello");
  });

  it("should return an empty string if input is empty", () => {
    expect(capitalize("")).toBe("");
  });

  it("should not change an already capitalized word", () => {
    const input = "World";
    const result = capitalize(input);
    expect(result).toBe("World");
  });
});
