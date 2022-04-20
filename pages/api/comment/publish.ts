import { ISession } from 'pages/api/index';
import { prepareConnection } from 'db/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { Article, Comment, User } from 'db/entity';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const { comment: content = '', articleId = 0 } = req.body;
  const session: ISession = req.session

  const db = await prepareConnection();
  const commentRepo = db.getRepository(Comment);
  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);

  const user = await userRepo.findOne({
    where: {
      id: session?.userId
    },
  });

  const article = await articleRepo.findOne({
    where:{
      id: articleId
    }
  })

  if(user  && article){
      const comment = new Comment();
      comment.content = content;
      comment.create_time = new Date();
      comment.update_time = new Date();
      comment.user = user
      comment.article = article
      comment.is_delete = 0

      await commentRepo.save(comment)
      res.status(200).json({
        code: 0,
        msg: 'success',
        data: comment
      })
  }else {
    res.status(200).json({
      code: 1,
      msg: '用户和文章出错'
    })
  }
 

 
}
