import { prepareConnection } from 'db/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from 'pages/api/index';
import { User, Article } from 'db/entity';
// import { Cookie } from 'next-cookie';
// import { setCookie } from 'utils';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { title = '', content = '' } = req.body;

  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    id: session.userId,
  });
  console.log(user);

  const article = new Article();
  if (user) {
    article.title = title;
    article.content = content;
    article.create_time = new Date();
    article.update_time = new Date();
    article.is_delete = 0;
    article.views = 0;
    article.user = user;
    console.log(article);
    const articleRes = await articleRepo.save(article);

    res.status(200).json({
      code: 0,
      msg: 'success',
      data: articleRes,
    });
  } else {
    res.status(200).json({
      code: 1,
      msg: '发布失败',
    });
  }
}
