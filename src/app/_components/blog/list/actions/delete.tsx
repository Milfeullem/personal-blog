'use client';

import type { MouseEventHandler } from 'react';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import type { PostItem } from '@/server/post/type';

import { postApi } from '@/api/post';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/shadcn/ui/tooltip';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../shadcn/ui/alert-dialog';
import { Button } from '../../../shadcn/ui/button';

export default function PostDelete({ item }: { item: PostItem }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const changeOpen = useCallback((value: boolean) => {
    setOpen(value);
  }, []);

  const close: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.preventDefault();
    setOpen(false);
  }, []);

  const deleteItem: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (e) => {
      e.preventDefault();
      setPending(true);

      const result = await postApi.delete(item.id);

      if (!result.ok) {
        toast.warning('删除失败', {
          id: 'post-delete-error',
          description: (await result.json()).message,
        });
      }

      setPending(false);
      setOpen(false);

      router.refresh();
    },
    [item.id, router],
  );

  const openDialog: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      changeOpen(true);
    },
    [changeOpen],
  );

  return (
    <AlertDialog open={open} onOpenChange={changeOpen}>
      <AlertDialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="text-xs" variant="ghost" size="sm" onClick={openDialog}>
                <Trash2 /> 删除
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>删除文章</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>是否确认删除该文章？</AlertDialogTitle>
          <AlertDialogDescription>当前不支持软删除，删除文章后将无法恢复</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} onClick={close}>
            取消
          </AlertDialogCancel>
          <AlertDialogAction onClick={deleteItem} disabled={pending}>
            {pending ? '删除中' : '确认'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
