import { convertToTitleCase } from "@/utils/stringUtils";

Object.defineProperty(String.prototype, "toTitleCase", {
  value: function toTitleCase() {
      return convertToTitleCase(value)
  },
  writable: true,
  configurable: true,
});