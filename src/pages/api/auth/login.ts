import type { APIRoute } from 'astro';
import { verifyCredentials, createSessionToken } from '~/lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response(JSON.stringify({ success: false, error: '请输入账号和密码' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!verifyCredentials(username, password)) {
      return new Response(JSON.stringify({ success: false, error: '账号或密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = createSessionToken(username);

    cookies.set('ks-admin-session', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, error: '请求格式错误' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
