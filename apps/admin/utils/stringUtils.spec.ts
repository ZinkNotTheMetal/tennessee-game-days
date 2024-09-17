import { describe, it } from "node:test";
import { convertToTitleCase } from "./stringUtils";

describe("", () => {
  it("must handle empty strings", () => {
    expect(convertToTitleCase("")).toBe("")
  })

  it("must handle values with only numbers handle empty strings", () => {
    expect(convertToTitleCase("1234")).toBe("1234")
  })
  
  it("must handle values with special characters", () => {
    expect(convertToTitleCase("#$%&")).toBe("#$%&")
  })

  it("must handle values with only spaces", () => {
    expect(convertToTitleCase("   ")).toBe("   ")
  })

  it("it must handle values with only one word", () => {
    expect(convertToTitleCase("hello")).toBe("Hello")
    expect(convertToTitleCase("world")).toBe("world")
    expect(convertToTitleCase("Hownd")).toBe("Hownd")
  })

  it("must handle values with multiple words", () => {
    expect(convertToTitleCase("world hello")).toBe("world hello")
    expect(convertToTitleCase("president of the united states")).toBe("President Of The United States")
    expect(convertToTitleCase("my Name")).toBe("My Name")
  })

  it("must handle values with all capitals", () => {
    expect(convertToTitleCase("HELLO WORLD")).toBe("Hello World")
    expect(convertToTitleCase("ALLCAPITALS")).toBe("Allcapitals")
  })

  it("must handle values that start with a space", () => {
    expect(convertToTitleCase(" HELLO WORLD")).toBe(" Hello World")
    expect(convertToTitleCase("  ALLCAPITALS")).toBe("  Allcapitals")
  })
})