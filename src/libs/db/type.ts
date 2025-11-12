export interface PaginateMeta {
  /**
   * 当前页项目数量
   */
  itemCount: number;
  /**
   * 项目总数量
   */
  totalItems?: number;
  /**
   * 每页显示数量
   */
  perPage: number;
  /**
   * 总页数
   */
  totalPages?: number;
  /**
   * 当前页数
   */
  currentPage: number;
}

export interface PaginateReturn<E> {
  meta: PaginateMeta & Record<string, any>;
  items: E[];
}

/**
 * 分页选项
 */
export interface PaginateOptions {
  /**
   * 当前页数
   */
  page?: number;
  /**
   * 每页显示数量
   */
  limit?: number;
}
