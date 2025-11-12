'use client';

import type { ChangeEventHandler, MouseEventHandler } from 'react';

import { isNil, trim } from 'lodash';
import Link from 'next/link';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { toast } from 'sonner';

import type { CategoryItem } from '@/server/category/types';
import type { TagItem } from '@/server/tag/type';

import { categoryApi } from '@/api/category';
import { tagApi } from '@/api/tag';
import { generateLowerString } from '@/libs/utils';

import type { PostActionFormProps, PostActionFormRef } from './types';

import Details from '../../collapsible/details';
import { MdxEditor } from '../../mdx/editor';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../shadcn/ui/form';
import { Input } from '../../shadcn/ui/input';
import { Textarea } from '../../shadcn/ui/textarea';
import { CategorySelect } from './category-select';
import { usePostActionForm, usePostFormSubmitHandler } from './hooks';
import { TagInput } from './tag';

export const PostActionForm = forwardRef<PostActionFormRef, PostActionFormProps>((props, ref) => {
  const isActionCreate = props.type === 'create';

  const [body, setBody] = useState<string | undefined>(
    isActionCreate ? '文章内容' : props.item.body,
  );

  const form = usePostActionForm(
    isActionCreate ? { type: props.type } : { type: props.type, item: props.item },
  );

  const submitHandler = usePostFormSubmitHandler(
    isActionCreate ? { type: 'create' } : { type: 'update', id: props.item.id },
  );

  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  const [categoryId, setCategoryId] = useState<string>(
    isActionCreate || isNil(props.item.category) ? '' : props.item.category.id,
  );

  useEffect(() => {
    if (!isNil(body)) {
      form.setValue('body', body);
    }
  }, [body, form]);
  useEffect(() => {
    form.setValue('categoryId', categoryId);
  }, [categoryId, form]);

  useEffect(() => {
    if (!isNil(props.setPending)) {
      props.setPending(form.formState.isSubmitting);
    }
  }, [form.formState.isSubmitting, props.setPending]);

  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
  const [tags, setTags] = useState<TagItem[]>(isActionCreate ? [] : props.item.tags);

  useEffect(() => {
    (async () => {
      const result = await categoryApi.list();
      if (!result.ok) {
        toast.warning('读取分类列表失败,请刷新', {
          id: 'category-list-error',
          description: (await result.json()).message,
        });
      } else {
        const data = await result.json();
        setAllCategories(data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await tagApi.list();
      if (!result.ok) {
        toast.warning('读取标签列表失败,请刷新', {
          id: 'tag-list-error',
          description: (await result.json()).message,
        });
      } else {
        const data = await result.json();
        setAllTags(data);
      }
    })();
  }, []);

  useDeepCompareEffect(() => {
    form.setValue('tags', tags);
  }, [tags]);

  const [slug, setSlug] = useState(isActionCreate ? '' : props.item.slug || '');
  const changeSlug: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => setSlug(e.target.value),
    [],
  );

  const generateTitleSlug: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();

    if (!form.formState.isSubmitting) {
      const title = trim(form.getValues('title'), '');

      title && setSlug(generateLowerString(title));
    }
  }, []);

  useEffect(() => {
    form.setValue('slug', slug);
  }, [form, slug]);

  useImperativeHandle(
    ref,
    () => ({
      save: form.handleSubmit(submitHandler),
    }),
    [form, submitHandler],
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8 grow-1 flex flex-col">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章标题</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请输入标题" disabled={form.formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Details summary="SEO相关字段">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem className="mt-2 border-b border-dashed pb-1">
                <FormLabel>摘要简述</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="请输入文章摘要"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>摘要会显示在文章列表页</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 border-b border-dashed pb-1">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>唯一URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={slug}
                      onChange={changeSlug}
                      placeholder="请输入唯一URL"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    如果留空,则文章访问地址是id
                    <Link
                      className="ml-5 mr-1 text-black dark:text-white"
                      href="#"
                      onClick={generateTitleSlug}
                      aria-disabled={form.formState.isSubmitting}
                    >
                      [点此]
                    </Link>
                    自动生成slug(根据标题使用&apos;-&apos;连接字符拼接而成,中文字自动转换为拼音)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="mt-2 border-b border-dashed pb-1">
                <div className="w-full flex-col space-y-2">
                  <FormLabel className="block">分类选择</FormLabel>
                  <FormControl className="block pt-1">
                    <CategorySelect
                      {...field}
                      value={categoryId}
                      setValue={setCategoryId}
                      categories={allCategories}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  选择一个分类后,在读取该分类的父分类(如果有)时,列表中也会包含此文章
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="mt-2 border-b border-dashed pb-1">
                <FormLabel>标签</FormLabel>
                <FormControl>
                  <TagInput
                    {...field}
                    placeholder="输入标签"
                    tags={tags}
                    setTags={(newTags) => setTags(newTags)}
                    className="w-full"
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                    autocompleteOptions={allTags}
                  />
                </FormControl>
                <FormDescription>
                  每个标签之间请用英文逗号(,)分割,
                  如果单独不设置SEO关键字则会根据标签生成关键字用于SEO
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem className="mt-2 border-b border-dashed pb-1">
                <FormLabel>关键字</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="请输入关键字,用逗号分割(关键字是可选的)"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  关键字不会显示,仅在SEO时发挥作用.每个关键字之间请用英文逗号(,)分割
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mt-2 border-b border-dashed pb-1">
                <FormLabel>文章描述</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="请输入文章描述"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>文章描述不会显示,仅在SEO时发挥作用</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Details>
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => {
            return (
              <FormItem className="grow-1 flex flex-col">
                <FormLabel>文章内容</FormLabel>
                <FormControl>
                  <MdxEditor
                    content={body}
                    setContent={setBody}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
});
