import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import request from 'service/fetch';

const UserInfo: NextPage = () => {
  const router = useRouter();
  const userId = router.query.id;

  useEffect(() => {
    request.get('/api/articles/' + userId).then((res: any) => {
      if (res?.code === 0) {
        console.log(res.data);
      } else {
        console.log('error');
      }
    });
  });
  return <div>UserInfo</div>;
};

export default UserInfo;
