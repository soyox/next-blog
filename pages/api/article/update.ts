import { prepareConnection } from 'db/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { Article } from 'db/entity';

export default withIronSessionApiRoute(update , ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { title = '', content = '', id = 0} = req.body;
  const qeury = req.query
  console.log('qeury', qeury);

  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);

 
  const article = await articleRepo.findOne({
    where: {
      id
    }
  })

  if (article){
    article.title = title
    article.content = content
    article.update_time = new Date()
    await articleRepo.save(article)
    res.status(200).json({
      code: 0,
      msg: 'success',
      // data: articleRes,
    });
  }else {
    res.status(200).json(
      {
        code: 1,
        msg: '没有该文章'
      }
    )
  }
 

    
}
