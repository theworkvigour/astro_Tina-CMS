import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken } from '~/lib/auth';

const protectedPrefixes = ['/keystatic', '/api/keystatic', '/admin'];
const publicPaths = [
  '/login',
  '/api/keystatic',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/change-password',
];

const toolbarSnippet = `
<script>
(function(){
  var style = document.createElement('style');
  style.textContent = \`
    #aw-toolbar { position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647; display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 6px 16px; background: #1e293b; color: #94a3b8; font-size: 13px; font-family: system-ui, sans-serif; }
    #aw-toolbar a { color: #e2e8f0; text-decoration: none; padding: 4px 10px; border-radius: 4px; }
    #aw-toolbar a:hover { background: #334155; color: #fff; }
    #aw-toolbar a.logout { color: #f87171; }
  \`;
  document.head.appendChild(style);
  var tb = document.createElement('div');
  tb.id = 'aw-toolbar';
  tb.innerHTML = '<a href="/">View site</a><a href="/login/change-password">\\u4FEE\\u6539\\u5BC6\\u7801</a><a class="logout" href="/api/auth/logout">\\u9000\\u51FA\\u767B\\u5F55</a>';
  document.body.appendChild(tb);
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
      const newHeaders = new Headers(response.headers);
      if (!newHeaders.has('content-type') || !newHeaders.get('content-type')?.includes('charset')) {
        newHeaders.set('content-type', 'text/html; charset=utf-8');
      }
      return new Response(finalHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }
  }

  return response;
});
