export function extractLastTwoDigits(input: string): number {
  const match = input.match(/(\d{2})\D*$/); // Match last two digits followed by optional non-digit characters at the end
  if (match) {
    return parseInt(match[1], 10);
  }
  return 69; // Return 69 if no match found
}

