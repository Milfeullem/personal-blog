import type { MouseEventHandler } from 'react';

import { isNil } from 'lodash';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import { toast } from 'sonner';

import { authApi } from '@/api/auth';
import { deleteCookie } from '@/libs/coolkies';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/libs/token';

import { useAuth } from '../../auth/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '../../shadcn/ui/avatar';
import { Button } from '../../shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../shadcn/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../shadcn/ui/tooltip';
import { cn } from '../../shadcn/utils';
import UserAvatar from './avatar.svg';
import $styles from './user.module.css';

export function LoginButton({ iconBtn }: { iconBtn?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" size="icon" className="ml-auto" variant="outline" asChild>
            <Link href="/auth/login">
              <User />
              {!iconBtn && '登录'}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>登录页面</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function UserAction({ iconBtn }: { iconBtn?: boolean }) {
  const auth = useAuth();
  const router = useRouter();

  const loginOut: MouseEventHandler<HTMLAnchorElement> = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const res = await authApi.logout();

        if (res.ok) {
          deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
          setAuth(null);
          router.push('/auth/login');
        }
      } catch (error) {
        toast.error('服务器错误,请重试！', {
          description: (error as Error).message,
        });
      }
    },
    [router],
  );

  return (
    <div className={cn($styles.user)}>
      {isNil(auth) ? (
        <Suspense>
          <LoginButton iconBtn={iconBtn} />
        </Suspense>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar className={$styles.avatar}>
              <AvatarImage src={UserAvatar.src} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 text-center text-stone-500">
            <DropdownMenuLabel className="justify-center">我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="#" onClick={loginOut}>
                退出登录
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
function setAuth(arg0: null) {
  throw new Error('Function not implemented.');
}
