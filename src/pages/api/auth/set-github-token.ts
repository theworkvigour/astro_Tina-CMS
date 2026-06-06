import type { APIRoute } from 'astro';
import { verifySessionToken } from '~/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionCookie = cookies.get('ks-admin-session')?.value;
    if (!sessionCookie) {
      return new Response(JSON.stringify({ success: false, error: '未登录' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = verifySessionToken(sessionCookie);
    if (!session) {
      return new Response(JSON.stringify({ success: false, error: '会话已过期' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== 'string') {
      return new Response(JSON.stringify({ success: false, error: '请输入 Token' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const verifyRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'foida-auth',
      },
    });

    if (!verifyRes.ok) {
      const reason = verifyRes.status === 401 ? 'Token 无效或已过期' : 'Token 验证失败';
      return new Response(JSON.stringify({ success: false, error: reason }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const repoRes = await fetch('https://api.github.com/repos/theworkvigour/astro_Tina-CMS', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'foida-auth',
      },
    });

    if (!repoRes.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Token 没有仓库访问权限' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    cookies.set('keystatic-gh-access-token', token, {
      path: '/',
      httpOnly: false,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, error: '服务器错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
