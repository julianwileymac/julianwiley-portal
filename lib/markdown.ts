/**
 * Shared markdown helpers used by every page that renders a migrated Hugo
 * file. Keeps the unsupported-shortcode treatment consistent across posts,
 * notes, and docs.
 */

/**
 * Replace residual `<UnportedShortcode source={...} />` JSX with a visible
 * blockquote so `react-markdown` doesn't choke on the embedded JSX. Same
 * downgrade strategy used in app/(public)/blog/[slug]/page.tsx.
 */
export function stripUnportedShortcodes(content: string): string {
  return content.replace(
    /<UnportedShortcode source=\{(.+?)\}\s*\/>/gs,
    (_, sourceJson) => {
      try {
        const code = JSON.parse(sourceJson);
        return `\n> WARNING: Unported Hugo shortcode (manual conversion needed): \`${String(code).replace(/`/g, "'")}\`\n`;
      } catch {
        return "\n> WARNING: Unported Hugo shortcode (manual conversion needed)\n";
      }
    },
  );
}
