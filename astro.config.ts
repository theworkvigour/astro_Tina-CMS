import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),

  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      filter: (page) =>
        !/\/(keystatic|admin|login|api|404|500)(?:\/|$)/.test(page) &&
        !/^\/keystatic(?:\/|$)/.test(page),
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [readingTimeRemarkPlugin],
      rehypePlugins: [responsiveTablesRehypePlugin],
    }),
  },

  vite: {
    server: {
      watch: {
        ignored: ['**/tina/**', '**/.tina/**', '**/tina-lock.json'],
      },
    },

    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        // Cloudflare workaround for React 19 MessageChannel error
        // https://github.com/withastro/adapters/pull/436
        ...(import.meta.env.PROD && {
          'react-dom/server': 'react-dom/server.edge',
        }),
      },
    },

    optimizeDeps: {
      exclude: [
        '@keystatic/astro/internal/keystatic-api.js',
        '@keystatic/astro/internal/keystatic-page.js',
      ],
    },
  },
});
