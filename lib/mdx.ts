import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFootnotes from "remark-footnotes";
import { Button } from "@/components/ui/Button";
import { Github, Satellite } from "lucide-react";

const mdxComponents = {
  Button,
  Github,
  Satellite,
};

/**
 * Compile an MDX string to a React component for server rendering.
 */
export async function mdxToContent(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        // `remark-gfm` pulls in the GFM footnotes HTML extension which expects
        // a `getData` function on the micromark compile context. In the
        // production build this function is missing, leading to the runtime
        // error `this.getData is not a function`. The blog content does not
        // rely on GFM-specific features, so we omit the plugin to avoid the
        // crash.
        remarkPlugins: [
          // Enable Markdown footnotes: [^1] references and inline ^[notes]
          [remarkFootnotes as unknown as any, { inlineNotes: true }],
        ],
        rehypePlugins: [
          rehypeSlug as unknown as any,
          rehypeAutolinkHeadings as unknown as any,
        ],
      },
    },
  });
  return content;
}

