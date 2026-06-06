import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: null, // 纯私有本地模式，不需要云端 ID
  token: null,
  build: {
    outputFolder: "admin", // 后台网页生成的目录：你的域名/admin
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images/products", // 拖拽上传的产品图自动存入 public/images/products
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      // 🛶 1. FOIDA 产品展示与技术参数管理
      {
        name: "products",
        label: "FOIDA 产品上架管理",
        path: "src/content/products", // 录入的产品数据会自动变成 JSON 躺在这里
        format: "json",
        fields: [
          { type: "string", name: "title", label: "产品型号/名称 (如 FOIDA RIB 330)", required: true },
          { type: "image", name: "image", label: "产品高清展示大图" },
          { type: "string", name: "length", label: "船体长度 (例如: 3.3m)" },
          { type: "string", name: "material", label: "面料工艺 (例如: 1.2mm PVC)" },
          { type: "string", name: "maxLoad", label: "最大承重 (例如: 650kg)" },
          // 📈 核心：嵌入式原生谷歌 SEO 面板
          {
            type: "object",
            name: "seo",
            label: "🔍 谷歌 SEO 优化选项 (TDK)",
            fields: [
              { type: "string", name: "metaTitle", label: "SEO 独立标题 (Meta Title)" },
              { type: "string", name: "metaDescription", label: "SEO 网页描述 (Meta Description)", ui: { component: "textarea" } },
            ],
          },
        ],
      },
      // ✍️ 2. FOIDA 官方博客发布管理（完美平替 AstroWind 自带的 post）
      {
        name: "post",
        label: "FOIDA 官方 Blog 发布",
        path: "src/content/post", // 原生无缝对接 AstroWind 的博客文件夹
        format: "md",
        fields: [
          { type: "string", name: "title", label: "文章标题", required: true, isTitle: true },
          { type: "datetime", name: "publishDate", label: "发布日期" },
          { type: "image", name: "image", label: "博客封面大图" },
          { type: "string", name: "excerpt", label: "文章摘要 (简短引流文案)", ui: { component: "textarea" } },
          { type: "rich-text", name: "body", label: "文章正文 (支持富文本排版/插入图片)", isBody: true },
          // 📈 核心：Blog 原生 SEO 面板
          {
            type: "object",
            name: "seo",
            label: "🔍 谷歌 SEO 优化选项 (TDK)",
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