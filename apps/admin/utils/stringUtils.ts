function convertToTitleCase(value: string): string {
  if (!value) return value;

  return value.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
}

export { convertToTitleCase }