# Vectoflare — Multilingual Astro + Cloudflare Workers

基于 [AstroWind](https://github.com/arthelokyo/astrowind) 改造的**配置驱动多语言网站**，支持 6 种语言的内容独立管理，每个语言部署为独立的 Cloudflare Worker。

## 语言

| Locale | URL |
|--------|-----|
| 🇬🇧 en | `https://vectoflare-en.theworkvigo.workers.dev` |
| 🇫🇷 fr | `https://vectoflare-fr.theworkvigo.workers.dev` |
| 🇩🇪 de | `https://vectoflare-de.theworkvigo.workers.dev` |
| 🇪🇸 es | `https://vectoflare-es.theworkvigo.workers.dev` |
| 🇵🇹 pt | `https://vectoflare-pt.theworkvigo.workers.dev` |
| 🇨🇳 zh | `https://vectoflare-zh.theworkvigo.workers.dev` |

## 架构

```
/
├── src/
│   ├── assets/styles/tailwind.css    # Tailwind CSS v4 配置
│   ├── components/                    # UI 组件 (common/, ui/, widgets/, blog/)
│   ├── data/                          # 多语言内容
│   │   ├── en/                        # 英文内容 (YAML/JSON/MD)
│   │   ├── fr/                        # 法文内容
│   │   ├── de/                        # 德文内容
│   │   ├── es/                        # 西文内容
│   │   ├── pt/                        # 葡文内容
│   │   ├── zh/                        # 中文内容
│   │   └── contact/                   # 联系表单提交 (加密)
│   ├── lib/                           # 工具库 (GitHub API, 联系表单, markdown等)
│   ├── pages/
│   │   ├── keystatic/                 # 自定义管理后台
│   │   │   ├── pages.astro            # 页面内容编辑
│   │   │   ├── navigation.astro       # 导航菜单编辑
│   │   │   ├── branding.astro         # 品牌配置编辑
│   │   │   ├── posts.astro            # 文章管理
│   │   │   ├── products.astro         # 产品管理
│   │   │   ├── contact-submissions.astro # 联系表单管理
│   │   │   ├── link-refactor.astro    # 链接重构工具
│   │   │   └── validate-links.astro   # 链接验证工具
│   │   ├── [locale]/                  # 本地化路由
│   │   └── api/admin/                 # 管理API
│   ├── config/                        # 每语言 YAML 配置 + 导航
│   │   ├── en/
│   │   ├── fr/
│   │   ├── ...
│   └── utils/locale.ts                # 语言工具函数
├── dist/                              # 构建产物 (per-locale)
│   └── server/wrangler.json           # 自动生成的 Cloudflare 配置
├── .github/workflows/actions.yaml     # CI/CD
├── astro.config.ts                    # Astro 配置
├── wrangler.toml                      # Cloudflare 全局配置
└── package.json
```

## 前置要求

- **Node.js >= 22.12.0**
- **Yarn 4.x** (corepack 自动管理)
- **Cloudflare 账号** (Worker + KV Namespace)
- **GitHub PAT** (用于管理后台保存内容)

## 本地开发

```shell
# 安装依赖
yarn install

# 开发英文版 (默认)
yarn dev

# 开发法文版
SITE_LOCALE=fr yarn dev

# 开发中文版
SITE_LOCALE=zh yarn dev
```

### .dev.vars

本地开发时，在项目根目录创建 `.dev.vars` 文件：

```
SESSION_SECRET=your-random-secret-here
```

用于会话加密和联系表单加密。

## 构建

每个语言独立构建，通过 `SITE_LOCALE` 环境变量指定：

```shell
# 构建英文版
SITE_LOCALE=en yarn build

# 构建所有语言
yarn build:all
```

构建产物在 `dist/` 目录。

## 部署

### 自动部署 (CI/CD)

推送代码到 `main` 分支会自动触发 GitHub Actions：

1. **check-astro** — 运行 `astro check` 检查
2. **build-and-deploy** — 为 6 个语言分别构建并部署到 Cloudflare Workers

部署位置：`vectoflare-{locale}.theworkvigo.workers.dev`

### 手动部署

```shell
# 构建并部署英文版
SITE_LOCALE=en yarn build
cd dist/server
yarn wrangler deploy --name vectoflare-en

# 构建并部署法文版
SITE_LOCALE=fr yarn build
cd dist/server
yarn wrangler deploy --name vectoflare-fr
```

### 密钥管理

```shell
# 设置会话密钥 (每个 Worker)
echo "your-secret" | yarn wrangler secret put SESSION_SECRET --name vectoflare-en
```

CI/CD 自动从 GitHub Secrets `SESSION_SECRET` 设置。

## 管理后台

每个语言的 Worker 都包含独立的管理后台，路径为 `/keystatic/`：

| 路径 | 功能 |
|------|------|
| `/keystatic` | 仪表盘 |
| `/keystatic/pages` | 编辑页面内容 |
| `/keystatic/navigation` | 编辑导航菜单 |
| `/keystatic/branding` | 编辑品牌配置 |
| `/keystatic/posts` | 管理文章 |
| `/keystatic/products` | 管理产品 |
| `/keystatic/contact-submissions` | 查看联系表单提交 |
| `/keystatic/link-refactor` | 链接/名称批量重构 |
| `/keystatic/validate-links` | 链接有效性验证 |
| `/keystatic/change-password` | 修改管理密码 |

### 首次使用

1. 访问 `https://vectoflare-en.theworkvigo.workers.dev/keystatic`
2. 输入管理员密码登录（默认密码在 `branding.yaml` 中配置）
3. 首次需要配置 GitHub Token：
   - 在 GitHub 创建一个 **Personal Access Token (classic)**，权限勾选 `repo`
   - 在管理后台 `/keystatic/` 中填入 Token
   - Token 会加密保存在浏览器 Cookie 中

### 内容保存

编辑内容后，管理后台通过 GitHub API 将变更直接提交到代码仓库的 `src/data/{locale}/` 目录。下次 CI 自动部署时更新线上网站。

### 内容回退机制

页面内容按以下优先级回退：
1. **当前语言的 JSON 内容**（在 `src/data/{locale}/pages.json` 中定义）
2. **英文内容**（如果当前语言没有定义）
3. **YAML 配置**（如果 JSON 也找不到）

## 联系表单

`/contact` 页面使用 SSR 模式，包含：

- **数学验证码** — HMAC 签名验证
- **蜜罐字段** — 隐藏字段反爬虫
- **速率限制** — 每个 IP 每小时 5 次
- **AES-256-GCM 加密** — 提交内容加密存储
- **GitHub 提交** — 加密记录保存到 `src/data/contact/submissions.enc.json`
- **邮件通知** — 通过 Resend API 发送（可选）

## 技术栈

- **Astro v6** — 框架
- **Tailwind CSS v4** — 样式 (CSS-first 配置)
- **Cloudflare Workers** — 部署平台 (SSR)
- **@astrojs/cloudflare** — Astro Cloudflare 适配器
- **@keystatic/core** — 内容 Schema 定义
- **js-yaml** — YAML 解析
- **GitHub API (octokit)** — 内容保存

## 项目命令

| 命令 | 作用 |
|------|------|
| `yarn dev` | 本地开发 (localhost:4321) |
| `yarn build` | 构建 (`SITE_LOCALE` 指定语言) |
| `yarn build:all` | 构建全部 6 种语言 |
| `yarn preview` | 预览构建产物 |
| `yarn check` | astro check + ESLint + Prettier |
| `yarn fix` | 自动修复 ESLint + Prettier |
| `yarn astro` | 运行 Astro CLI |

## CI/CD 环境变量

在 GitHub 仓库设置以下 Secrets:

| Secret | 用途 |
|--------|------|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌 (需要有 Workers + KV 权限) |
| `SESSION_SECRET` | 会话加密密钥 (随机字符串) |
