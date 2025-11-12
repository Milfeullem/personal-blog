import { isNil } from 'lodash';

import type { CategoryItem } from '@/server/category/types';

import { categoryApi } from '@/api/category';

import type { IBlogBreadcrumbItem } from './breadcrumb';

export const getBreadcrumbsLinks = (
  categories: CategoryItem[],
  type: 'breadcrumb' | 'post' = 'breadcrumb',
): IBlogBreadcrumbItem[] => {
  let link = '';

  return categories.map((category, index) => {
    const item: IBlogBreadcrumbItem = {
      id: category.id,
      text: category.name,
    };

    if (index < categories.length - 1 || type === 'post') {
      link = `${link}/${category.slug || category.id}`;
      item.link = link;
    }

    return item;
  });
};

export const getBreadcrumbsCategories = async (
  categories?: string[],
): Promise<CategoryItem[] | false> => {
  if (isNil(categories) || !categories.length) {
    return [];
  }

  const latest = categories[categories.length - 1];
  const result = await categoryApi.breadcrumb(latest);

  if (!result.ok) {
    throw new Error((await result.json()).message);
  }

  const items = await result.json();

  if (items.length !== categories.length) {
    return false;
  }

  if (
    !items.every((item, index) => item.id === categories[index] || item.slug === categories[index])
  ) {
    return false;
  }

  return items;
};
