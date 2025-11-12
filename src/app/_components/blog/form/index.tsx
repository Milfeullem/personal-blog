'use client';

import type { MouseEventHandler } from 'react';

import { isNil } from 'lodash';
import { Save } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import type { PostActionFormRef } from '@/app/_components/blog/form/types';
import type { PostItem } from '@/server/post/type';

import { PostActionForm } from '@/app/_components/blog/form/action-form';
import { Button } from '@/app/_components/shadcn/ui/button';

/**
 * 对action-form的封装，直接用于文章创建和编辑页面
 * 通过判断post是否为null来决定是创建还是编辑
 * @param props
 */
export function PostPageForm({ post }: { post?: PostItem }) {
  const ref = useRef<PostActionFormRef | null>(null);
  const [pending, setPending] = useState(false);

  const changePending = useCallback((value: boolean) => {
    setPending(value);
  }, []);

  const savePost = useCallback<MouseEventHandler<HTMLButtonElement>>(async (e) => {
    e.preventDefault();

    ref.current?.save && (await ref.current.save());
  }, []);

  return (
    <>
      <div className="flex justify-between">
        <Button className="ml-auto" onClick={savePost} disabled={pending}>
          {pending ? '保存中...' : '保存'}
          <Save />
        </Button>
      </div>
      {!isNil(post) ? (
        <PostActionForm ref={ref} type="update" setPending={changePending} item={post} />
      ) : (
        <PostActionForm ref={ref} type="create" setPending={changePending} />
      )}
    </>
  );
}
