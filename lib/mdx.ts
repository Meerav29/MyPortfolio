import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * Compile an MDX string to a React component for server rendering.
 */
export async function mdxToContent(source: string) {
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        // `remark-gfm` pulls in the GFM footnotes HTML extension which expects
        // a `getData` function on the micromark compile context. In the
        // production build this function is missing, leading to the runtime
        // error `this.getData is not a function`. The blog content does not
        // rely on GFM-specific features, so we omit the plugin to avoid the
        // crash.
        remarkPlugins: [],
        rehypePlugins: [
          rehypeSlug as unknown as any,
          rehypeAutolinkHeadings as unknown as any,
        ],
      },
    },
  });
  return content;
}
