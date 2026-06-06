import { config, fields, collection } from '@keystatic/core';

const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? { kind: 'github', repo: 'theworkvigour/astro_Tina-CMS' }
    : { kind: 'local' },

  ui: { brand: { name: 'Foida 管理系统' } },

  collections: {
    post: collection({
      label: '博客文章 / Blog',
      slugField: 'title',
      path: 'src/data/post/*',
      format: { data: 'yaml' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: '文章标题 / Title' } }),
        publishDate: fields.date({ label: '发布日期 / Publish Date', defaultValue: { kind: 'today' } }),
        updateDate: fields.date({ label: '更新日期 / Update Date' }),
        draft: fields.checkbox({ label: '草稿 / Draft', defaultValue: false }),
        excerpt: fields.text({ label: '文章摘要 / Excerpt', multiline: true }),
        image: fields.text({ label: '封面图片URL / Cover Image URL' }),
        category: fields.text({ label: '分类 / Category' }),
        tags: fields.array(fields.text({ label: '标签 / Tag' }), {
          label: '标签 / Tags',
          itemLabel: (props) => props.value || '标签',
        }),
        author: fields.text({ label: '作者 / Author' }),
        metadata: fields.object(
          {
            title: fields.text({ label: 'SEO 标题 / Meta Title' }),
            description: fields.text({ label: 'SEO 描述 / Meta Description', multiline: true }),
            canonical: fields.text({ label: 'Canonical URL' }),
            ignoreTitleTemplate: fields.checkbox({ label: '忽略标题模板 / Ignore Title Template' }),
            robots: fields.object(
              {
                index: fields.checkbox({ label: 'Index', defaultValue: true }),
                follow: fields.checkbox({ label: 'Follow', defaultValue: true }),
              },
              { label: 'Robots' }
            ),
            openGraph: fields.object(
              {
                url: fields.text({ label: 'OG URL' }),
                siteName: fields.text({ label: 'OG Site Name' }),
                locale: fields.text({ label: 'OG Locale' }),
                type: fields.text({ label: 'OG Type (e.g. website, article)' }),
                images: fields.array(
                  fields.object({
                    url: fields.text({ label: '图片URL / Image URL' }),
                    width: fields.integer({ label: '宽度 / Width' }),
                    height: fields.integer({ label: '高度 / Height' }),
                  }),
                  { label: 'OG Images' }
                ),
              },
              { label: 'Open Graph' }
            ),
            twitter: fields.object(
              {
                handle: fields.text({ label: 'Twitter Handle' }),
                site: fields.text({ label: 'Twitter Site' }),
                cardType: fields.text({ label: 'Card Type (summary, summary_large_image)' }),
              },
              { label: 'Twitter Card' }
            ),
          },
          { label: 'SEO / 元数据' }
        ),
        content: fields.mdx({ label: '正文 / Content' }),
      },
    }),

    product: collection({
      label: '产品 / Products',
      slugField: 'title',
      path: 'src/data/product/*',
      format: { data: 'yaml' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: '产品名称 / Product Name' } }),
        sku: fields.text({ label: '产品编号 / SKU' }),
        summary: fields.text({ label: '一句话简介 / Summary', multiline: true }),
        description: fields.text({ label: '详细描述 / Description', multiline: true }),
        image: fields.text({ label: '主图URL / Main Image URL' }),
        gallery: fields.array(
          fields.object({
            url: fields.text({ label: '图片URL / Image URL' }),
            alt: fields.text({ label: '图片说明 / Alt' }),
          }),
          { label: '产品图册 / Gallery', itemLabel: (props) => props.value.alt || props.value.url || '图片' }
        ),
        category: fields.select(
          [
            { label: 'RIB 动力艇 / RIB', value: 'rib' },
            { label: '充气艇 / Inflatable', value: 'inflatable' },
            { label: '配件 / Accessories', value: 'accessory' },
            { label: '服务 / Service', value: 'service' },
          ],
          { label: '产品分类 / Category', defaultValue: 'inflatable' }
        ),
        tags: fields.array(fields.text({ label: '标签 / Tag' }), {
          label: '标签 / Tags',
          itemLabel: (props) => props.value || '标签',
        }),
        specs: fields.array(
          fields.object({
            label: fields.text({ label: '规格名 / Spec Name' }),
            value: fields.text({ label: '规格值 / Spec Value' }),
          }),
          { label: '技术规格 / Specifications', itemLabel: (props) => `${props.value.label}: ${props.value.value}` || '规格' }
        ),
        price: fields.object(
          {
            amount: fields.text({ label: '价格 / Price' }),
            currency: fields.text({ label: '货币 / Currency', defaultValue: 'USD' }),
            note: fields.text({ label: '价格说明 / Note' }),
          },
          { label: '价格 / Price' }
        ),
        inStock: fields.checkbox({ label: '现货 / In Stock', defaultValue: true }),
        featured: fields.checkbox({ label: '首页推荐 / Featured', defaultValue: false }),
        publishDate: fields.date({ label: '上架日期 / Publish Date', defaultValue: { kind: 'today' } }),
        draft: fields.checkbox({ label: '草稿 / Draft', defaultValue: false }),
        metadata: fields.object(
          {
            title: fields.text({ label: 'SEO 标题 / Meta Title' }),
            description: fields.text({ label: 'SEO 描述 / Meta Description', multiline: true }),
            canonical: fields.text({ label: 'Canonical URL' }),
            ignoreTitleTemplate: fields.checkbox({ label: '忽略标题模板 / Ignore Title Template' }),
            robots: fields.object(
              {
                index: fields.checkbox({ label: 'Index', defaultValue: true }),
                follow: fields.checkbox({ label: 'Follow', defaultValue: true }),
              },
              { label: 'Robots' }
            ),
            openGraph: fields.object(
              {
                url: fields.text({ label: 'OG URL' }),
                siteName: fields.text({ label: 'OG Site Name' }),
                locale: fields.text({ label: 'OG Locale' }),
                type: fields.text({ label: 'OG Type' }),
                images: fields.array(
                  fields.object({
                    url: fields.text({ label: '图片URL / Image URL' }),
                    width: fields.integer({ label: '宽度 / Width' }),
                    height: fields.integer({ label: '高度 / Height' }),
                  }),
                  { label: 'OG Images' }
                ),
              },
              { label: 'Open Graph' }
            ),
            twitter: fields.object(
              {
                handle: fields.text({ label: 'Twitter Handle' }),
                site: fields.text({ label: 'Twitter Site' }),
                cardType: fields.text({ label: 'Card Type' }),
              },
              { label: 'Twitter Card' }
            ),
          },
          { label: 'SEO / 元数据' }
        ),
        content: fields.mdx({ label: '产品详情 / Details' }),
      },
    }),
  },
});
