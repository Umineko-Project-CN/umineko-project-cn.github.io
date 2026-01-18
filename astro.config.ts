import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { visualizer } from "rollup-plugin-visualizer";
import type { Root as HastRoot, Element as HastElement } from "hast";
import type { Root as MdastRoot } from "mdast";
import { visit } from "unist-util-visit";
import remarkCjkFriendly from "remark-cjk-friendly";

// https://astro.build/config
export default defineConfig({
  site: "https://snsteam.club",
  vite: {
    plugins: [
      tailwindcss(),
      visualizer({
        emitFile: true,
        filename: "stats.html",
      }),
    ],
  },
  image: {
    layout: "constrained",
  },
  markdown: {
    remarkPlugins: [setDefaultLayout, remarkCjkFriendly],
    rehypePlugins: [rehypeTableWrapper],
  },
  integrations: [
    mdx({
      shikiConfig: { theme: "dark-plus" },
    }),
    sitemap(),
  ],
});

function setDefaultLayout() {
  return function (
    _: MdastRoot,
    file: { data: { astro?: { frontmatter?: Record<string, unknown> } } },
  ) {
    const { frontmatter } = file.data.astro ?? {};
    if (frontmatter && !frontmatter.layout) {
      frontmatter.layout = "@layouts/PageLayout.astro";
    }
  };
}

function rehypeTableWrapper() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "table" && parent && typeof index === "number") {
        const wrapper: HastElement = {
          type: "element",
          tagName: "div",
          properties: { className: ["overflow-x-auto"] },
          children: [node],
        };
        parent.children[index] = wrapper;
        return "skip";
      }
    });
  };
}
