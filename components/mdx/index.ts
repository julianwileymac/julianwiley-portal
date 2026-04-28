// Map of MDX components available inside .mdx files.
//
// We deliberately keep this tree small at the top level — every component
// imported here is pulled into the RSC server bundle for the blog post
// pages, and Ant Design icons / hook-using components have caused
// React-version cross-boundary issues at prerender time. Heavier components
// (Mermaid, CodeTabs, etc.) are still exported individually below for
// authors who want to import them directly inside an .mdx file.

import { Note } from "./Note";
import { Callout } from "./Callout";
import { TechStack } from "./TechStack";
import { ProjectShowcase } from "./ProjectShowcase";
import { EmbedPdf } from "./EmbedPdf";
import { TocInline } from "./TocInline";
import { UnportedShortcode } from "./UnportedShortcode";

export const mdxComponents = {
  Note,
  Callout,
  TechStack,
  ProjectShowcase,
  EmbedPdf,
  TocInline,
  UnportedShortcode,
};

export {
  Note,
  Callout,
  TechStack,
  ProjectShowcase,
  EmbedPdf,
  TocInline,
  UnportedShortcode,
};

// Re-export client-only MDX helpers that authors can opt into per-file.
export { Mermaid } from "./Mermaid";
export { CodeTabs } from "./CodeTabs";
