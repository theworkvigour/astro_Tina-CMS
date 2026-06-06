import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: null,
  token: null,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images/products",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "products",
        label: "FOIDA 产品上架管理",
        path: "src/content/products",
        format: "json",
        fields: [
          { type: "string", name: "title", label: "产品型号/名称 (如 FOIDA RIB 330)", required: true },
          { type: "image", name: "image", label: "产品高清展示大图" },
          { type: "string", name: "length", label: "船体长度 (例如: 3.3m)" },
          { type: "string", name: "material", label: "面料工艺 (例如: 1.2mm PVC)" },
          { type: "string", name: "maxLoad", label: "最大承重 (例如: 650kg)" },
          {
            type: "object",
            name: "seo",
            label: "?? 谷歌 SEO 优化选项 (TDK)",
            fields: [
              { type: "string", name: "metaTitle", label: "SEO 独立标题 (Meta Title)" },
              { type: "string", name: "metaDescription", label: "SEO 网页描述 (Meta Description)", ui: { component: "textarea" } },
            ],
          },
        ],
      },
      {
        name: "post",
        label: "FOIDA 官方 Blog 发布",
        path: "src/content/post",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "文章标题", required: true, isTitle: true },
          { type: "datetime", name: "publishDate", label: "发布日期" },
          { type: "image", name: "image", label: "博客封面大图" },
          { type: "string", name: "excerpt", label: "文章摘要 (简短引流文案)", ui: { component: "textarea" } },
          { type: "rich-text", name: "body", label: "文章正文", isBody: true },
          {
            type: "object",
            name: "seo",
            label: "?? 谷歌 SEO 优化选项 (TDK)",
            fields: [
              { type: "string", name: "metaTitle", label: "SEO 标题" },
              { type: "string", name: "metaDescription", label: "SEO 描述", ui: { component: "textarea" } },
            ],
          },
        ],
      },
    ],
  },
});
