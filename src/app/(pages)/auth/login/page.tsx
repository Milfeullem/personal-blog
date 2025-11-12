import type { Metadata, ResolvingMetadata } from 'next';

import { AuthLoginForm } from '@/app/_components/auth/login-form';

import $styles from './style.module.css';

export async function generateMetadata(_: any, parent: ResolvingMetadata): Promise<Metadata> {
  return {
    title: `用户登录 - ${(await parent).title?.absolute}`,
    description: '用户登录页面',
  };
}

export default function AuthLoginPage() {
  return (
    <div className="page-item">
      <div className="page-container">
        <div className={$styles.item} style={{ flex: 'none' }}>
          <div className="text-center text-xl font-bold">用户登录</div>
          <AuthLoginForm />
        </div>
      </div>
    </div>
  );
}
