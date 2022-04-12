import type { NextPage } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import { navs } from './config';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import Login from 'components/Login';

const Mavbar: NextPage = () => {
  const router = useRouter();

  const [isShowLogin, setIsShowLogin] = useState(true);

  const handleGotoEditorPage = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    // 登录弹窗关闭
    setIsShowLogin(false);
  };
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
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose}></Login>
    </div>
  );
};

export default Mavbar;
