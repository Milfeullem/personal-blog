import type { HydrateProps, SerializeResult } from 'next-mdx-remote-client';
import type { MDXRemoteProps } from 'next-mdx-remote-client/rsc';
import type { TocItem } from 'remark-flexible-toc';
import type { Compatible } from 'vfile';
/**
 * mdx序列化配置
 */
export type MdxSerializeOption = Omit<MDXRemoteProps, 'source'>;

/**
 * mdx渲染器组件props
 */
export interface MdxRenderProps {
  source: Compatible;
  header?: React.ReactNode;
  options?: MdxSerializeOption;
  hydrate?: MdxHydrateOptions;
}

/**
 * mdx作用域
 */
interface Scope {
  /**
   * toc目录数据
   */
  toc?: TocItem[];
}

/**
 * mdx水合配置
 */
export type MdxHydrateOptions = Omit<HydrateProps, 'compiledSource'> & {
  /**
   * 是否显示toc目录
   */
  toc?: boolean;
};

/**
 * mdx水合组件props
 */
export interface MdxHydrateProps extends MdxHydrateOptions {
  serialized: SerializeResult<Record<string, unknown>, Scope>;
}

export interface MdxEditorProps {
  content?: string;
  setContent: (value?: string) => void;
  disabled?: boolean;
}

/**
 * mdx水合组件props
 */
export interface MdxHydrateProps extends MdxHydrateOptions {
  header?: React.ReactNode;
  serialized: SerializeResult<Record<string, unknown>, Scope>;
}
