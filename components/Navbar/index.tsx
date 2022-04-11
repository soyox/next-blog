import type { NextPage } from 'next';
import Link from 'next/link';
import { navs } from './config';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
const Mavbar: NextPage = () => {
  const router = useRouter();
  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.value}>
            <a className={router.pathname === nav.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Mavbar;
