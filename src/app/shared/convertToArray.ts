// Function to convert a comma-separated string into an array
export function convertToArray(text: string, delimiter = ",") {
  return text.split(delimiter).map((item) => item.trim());
}
