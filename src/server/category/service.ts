'use server';

import type { Category } from '@prisma/client';

import { isNil } from 'lodash';

import db from '@/libs/db/client';

import type { CategoryItem } from './types';

/**
 * 构建树形结构
 * @param items 所有分类项目
 * @returns 树形结构的根节点数组
 */
function buildTree(data: CategoryItem[]): CategoryItem[] {
  if (data.length === 0) {
    return [];
  }

  const sortedNodes = data.toSorted((a, b) => a.path.length - b.path.length) as CategoryItem[];
  const map: { [path: string]: CategoryItem } = {};
  const roots: CategoryItem[] = [];

  for (const node of sortedNodes) {
    const currentNode: CategoryItem = {
      ...node,
    };
    const path = currentNode.path;

    map[path] = currentNode;

    if (currentNode.depth === data[0].depth) {
      roots.push(currentNode);
    } else {
      // 计算父路径（移除最后 4 位）
      const parentPath = path.slice(0, -4);
      const parentNode = map[parentPath];

      if (parentNode) {
        parentNode.children = parentNode.children ?? [];
        parentNode.children.push(currentNode);
      }
    }
  }

  // 按原始路径顺序排序根节点
  return roots.sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * 递归获取扁平化树
 * @param items
 */
function getFlatTree(items: CategoryItem[]): CategoryItem[] {
  return items.reduce<CategoryItem[]>((o, n) => {
    if (isNil(n.children)) {
      return [...o, n];
    }

    return [...o, n, ...getFlatTree(n.children)];
  }, []);
}

/**
 * 查询分类树信息
 * @param parentId
 */
export async function queryCategoryDescendants(parent?: string): Promise<CategoryItem[]> {
  const categories = await db.category.findMany({
    where: parent ? { OR: [{ id: parent }, { slug: parent }] } : { depth: 1 },
  });

  return (
    await Promise.all(
      categories.map(async (category) => {
        const children = await db.category.findDescendants({
          where: { id: category.id },
        });
        return [category, ...(children ?? [])];
      }),
    )
  ).reduce((o, n) => [...o, ...n], []);
}
/**
 * 查询分类树信息
 * @param parentId
 */
export async function queryCategoryTree(parent?: string): Promise<CategoryItem[]> {
  const categories = await queryCategoryDescendants(parent);

  return buildTree(categories);
}

/**
 * 查询结合列表(扁平树)信息
 * @param parentId
 */
export async function queryCategoryList(parent?: string): Promise<CategoryItem[]> {
  const categories = await queryCategoryDescendants(parent);

  return getFlatTree(categories);
}

/**
 * 获取分类面包屑
 * @param latest
 */
export async function queryCategoryBreadcrumb(latest: string): Promise<Category[]> {
  return await db.category.getAncestorsWithCurrent({
    where: { OR: [{ id: latest }, { slug: latest }] },
  });
}
