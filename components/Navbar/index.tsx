import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { navs } from './config';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import Login from 'components/Login';
import { UserOutlined } from '@ant-design/icons';

const Mavbar: NextPage = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [isShowLogin, setIsShowLogin] = useState(false);

  const { push } = useRouter();

  let cookieObj: { [key: string]: string } = {};
  useEffect(() => {
    const cookie = document.cookie;

    cookie.split(' ').forEach((item) => {
      const entry = item.slice(0, -1).split('=');
      let value = entry[1];
      if (entry.length > 2) {
        value = entry.slice(1).join('');
      }

      cookieObj[entry[0]] = value;
    });
    console.log('cookie', cookieObj);
    if (cookieObj['userId']) setIsLogin(true);
  }, [cookieObj]);

  const handleGotoEditorPage = () => {
    push('/editor/new');
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    // 登录弹窗关闭
    setIsShowLogin(false);
  };

  function handleAvatarClick() {
    setIsLogin(false);
    document.cookie = '';
  }

  function goUserIndex() {
    push('/user/' + cookieObj.userId);
  }

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
        {isLogin ? (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key={'index'} onClick={goUserIndex}>
                  主页
                </Menu.Item>
              </Menu>
            }
          >
            <Avatar
              size="large"
              icon={<UserOutlined onClick={handleAvatarClick} />}
            />
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose}></Login>
    </div>
  );
};

export default Mavbar;
