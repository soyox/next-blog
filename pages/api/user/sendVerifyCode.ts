import request from 'service/fetch';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import {ISession} from 'pages/api/index'

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const { to, templateId } = req.body;
  const session: ISession = req.session;
  const APPID = '8a216da88008322e018018ba018e037b',
    ACCOUNT_ID = '8a216da88008322e018018ba009c0374',
    AUTH_TOKEN = '3a793e0ce32d494f9132a5d5ba52ba17',
    NOW_DATA = format(new Date(), 'yyyyMMddHHmmss'),
    SIGPARAMETER = md5(`${ACCOUNT_ID}${AUTH_TOKEN}${NOW_DATA}`),
    AUTORIZATION = encode(`${ACCOUNT_ID}:${NOW_DATA}`),
    url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${ACCOUNT_ID}/SMS/TemplateSMS?sig=${SIGPARAMETER}`,
    verifyCode = Math.floor(Math.random() * (9999 - 1000) + 1000),
    expireMinute = '5';

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId: APPID,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization: AUTORIZATION,
      },
    }
  );

  console.log(response);
  const {statusCode,TemplateSMS, statusMsg} = response as any
  if (statusCode === '000000') {
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
    code: 0,
    msg: statusMsg,
    data: {
      TemplateSMS
    }
  })
  }else {
     res.status(200).json({
    code: statusCode,
    msg: statusMsg,
  });
  }

  

 
}
