import type { NextPage } from 'next';
import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import CountDown from 'components/CountDown';
import { message } from 'antd';
import request from 'service/fetch';

interface LoginProps {
  isShow: boolean;
  onClose: () => void;
}
const Login: NextPage<LoginProps> = (props) => {
  const { isShow, onClose } = props;
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);

  const handleClose = () => {
    onClose && onClose();
    setForm({
      phone: '',
      verify: '',
    });
  };

  const handleGetVerifyCode = () => {
    const phoneReg =
      /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    if (!form.phone || !phoneReg.test(form.phone)) {
      message.warning('请输入正确的手机号');
      return;
    }

    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res.code === 0) {
          console.log(res);
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  const handleOAuthGit = () => {};

  const handleLogin = () => {
    request
      .post('/api/user/login', {
        ...form,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          // 登陆成功

          onClose && onClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleCountEnd = () => {
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.close} onClick={handleClose}>
            <span>×</span>
          </div>
        </div>
        <input
          name="phone"
          type="text"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            name="verify"
            type="text"
            placeholder="输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={3} onEnd={handleCountEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGit}>
          使用Github登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a
            href="https://moco.imooc.com/privacy.html"
            target={'_blank'}
            rel="noreferrer"
          >
            隐私协议协议
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

Login.defaultProps = {
  isShow: false,
  onClose: () => {},
};

export default Login;
