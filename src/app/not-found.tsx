import $styles from './(pages)/layout.module.css';
import { ErrorNotFound } from './_components/errors/not-found';
import { Header } from './_components/layout/header';
import Theme from './_components/theme';

export default function AppNotFound() {
  return (
    <Theme>
      <div className={$styles.layout}>
        <Header />
        <ErrorNotFound />
      </div>
    </Theme>
  );
}
