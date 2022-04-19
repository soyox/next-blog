import { prepareConnection } from 'db/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from 'pages/api/index';
import { User, UserAuth } from 'db/entity';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;

  // const userRepo = db.getRepository(User);
  const db = await prepareConnection();

  const userAuthRepo = db.getRepository(UserAuth);

  const cookies = Cookie.fromApiRoute(req, res);

  if (String(session.verifyCode) === String(verify)) {
    // 验证码正确 在user_auths表查找
    const userAuth = await userAuthRepo.findOne(
      {
        identity_type,
        identifier: phone,
      },
      {
        relations: ['user'],
      }
    );

    if (userAuth) {
      // 已存在用户
      const user = userAuth.user;
      const { id, nickname, avatar } = user;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      userAuthRepo.update(userAuth.id, { credential: session.verifyCode });
      await session.save();

      setCookie(cookies, { userId: id, nickname, avatar });

      res?.status(200).json({
        code: 0,
        msg: '登陆成功',
        data: {
          user_id: id,
          nickname,
          avatar,
        },
      });
    } else {
      // 新用户自动注册
      const user = new User();
      user.nickname = `用户_${phone}`;
      user.avatar = `https://img0.baidu.com/it/u=1036575455,1126937155&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500`;
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);

      const {
        user: { id, nickname, avatar },
      } = resUserAuth;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      setCookie(cookies, { userId: id, nickname, avatar });

      res?.status(200).json({
        code: 0,
        msg: '登陆成功',
        data: {
          user_id: id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    res?.status(200).json({
      code: -1,
      msg: '验证码错误',
    });
  }
}
