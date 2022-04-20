import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { navs } from './config';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, Menu, message } from 'antd';
import Login from 'components/Login';
import { useRecoilState } from 'recoil';
import { userState } from 'store';

const Mavbar: NextPage = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [isShowLogin, setIsShowLogin] = useState(false);

  const [user, setUser] = useRecoilState(userState);

  const { push } = useRouter();

  let [cookieObj, setCookieObj] = useState<{ [key: string]: string } >({});
  useEffect(() => {
    const cookie = document.cookie;
    const tempObj:{ [key: string]: string } = {}
    cookie.split(' ').forEach((item) => {
      const entry = item.slice(0, -1).split('=');
      let value = entry[1];
      if (entry.length > 2) {
        value = entry.slice(1).join('');
      }
      if(entry[0] === 'nickname' || entry[0] === 'avatar'){
        value = decodeURIComponent(value)
      }
      tempObj[entry[0]] = value;
    });
    setCookieObj(tempObj)
    if (tempObj['userId']) {
      setUser({
        userId: tempObj.userId,
        nickname: tempObj.nickname,
        avatar: tempObj.avatar
      })
      setIsLogin(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  // setUser({
  //   userId: 1,
  // });

  const handleGotoEditorPage = () => {
    if(!user.userId){
      message.error('登录后发表文章')
      setIsShowLogin(true)
    }else{

      push('/editor/new');
    }
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    // 登录弹窗关闭
    setIsShowLogin(false);
  };

  

  function goUserIndex() {
    push('/user/' + cookieObj.userId);
  }

  return (
    <div className={styles.navbarContainer}>
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
              src={user.avatar}
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
    </div>
  );
};

export default Mavbar;
