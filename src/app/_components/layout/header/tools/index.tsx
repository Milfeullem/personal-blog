import { useAuth } from '@/app/_components/auth/hooks';

import { ShadcnThemeSetting } from '../../../theme/setting';
import { UserAction } from '../user';
import { ApiDocButton } from './api-doc';
import { PostCreateButton } from './post-create';
import $styles from './style.module.css';

export function HeaderTools({ isMobile }: { isMobile: boolean }) {
  const auth = useAuth();

  return (
    <div className={$styles.tools}>
      {auth && <PostCreateButton iconBtn={isMobile} />}
      <ApiDocButton />
      <ShadcnThemeSetting />
      <UserAction iconBtn={isMobile} />
    </div>
  );
}
