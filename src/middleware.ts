import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from '~/lib/auth';

const protectedPrefixes = ['/keystatic', '/api/keystatic', '/admin'];
const publicPaths = [
  '/login',
  '/api/keystatic',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/change-password',
  '/api/auth/set-github-token',
];

const toolbarSnippet = `
<script>
(function(){
  var style = document.createElement('style');
  style.textContent = \`
    [class*="branch"] { display: none !important; }
    #aw-toolbar { position: fixed; top: 0; left: 0; right: 0; z-index: 99999; display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 6px 16px; background: #1e293b; color: #94a3b8; font-size: 13px; font-family: system-ui, sans-serif; }
    #aw-toolbar a { color: #e2e8f0; text-decoration: none; padding: 4px 10px; border-radius: 4px; }
    #aw-toolbar a:hover { background: #334155; color: #fff; }
    #aw-toolbar a.logout { color: #f87171; }
    body { padding-top: 36px !important; }
  \`;
  document.head.appendChild(style);
  var tb = document.createElement('div');
  tb.id = 'aw-toolbar';
  tb.innerHTML = '<a href="/">View site</a><a href="/login/change-password">修改密码</a><a class="logout" href="/api/auth/logout">退出登录</a>';
  document.body.prepend(tb);
})();
</script>`;

export const onRequest = defineMiddleware(async (context, next) => {
  const url = context.url.pathname;

  const isProtected = protectedPrefixes.some((p) => url === p || url.startsWith(p + '/') || (p.endsWith('/') && url.startsWith(p)));
  const isPublic = publicPaths.some((p) => url === p || url.startsWith(p + '/'));

  if (isProtected && !isPublic) {
    const sessionCookie = context.cookies.get('ks-admin-session')?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (!session) {
      return context.redirect('/login');
    }
  }

  const response = await next();

  if ((url === '/keystatic' || url.startsWith('/keystatic/')) && !url.startsWith('/api/')) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      const html = await response.text();
      const finalHtml = html.includes('</body>') ? html.replace('</body>', toolbarSnippet + '</body>') : html + toolbarSnippet;
      return new Response(finalHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
  }

  return response;
});
