let clipboard: typeof import('clipboardy') | null = null;

export async function copyToClipboard(text: string): Promise<void> {
  try {
    clipboard = await import('clipboardy');
    await clipboard.default.write(text);
  } catch {
    // clipboard not available — silently fall back to stdout
  }
}
