import { User } from 'db/entity/user';
import { prepareConnection } from 'db/index';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verify = '' } = req.body;

  const db = await prepareConnection();

  const userRepo = db.getRepository(User);
  console.log(userRepo.find());

  console.log(phone, verify);

  res.json({
    code: 0,
    msg: 'success',
    data: {
      phone,
      verify,
    },
  });
}
