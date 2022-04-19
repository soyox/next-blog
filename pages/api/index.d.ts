import { IronSession } from 'iron-session';

export type ISession = IronSession & Record<string, any>;

export type ArticleType = {
  id: number,
  title: string,
  content: string,
  create_time: Date,
  update_time: Date,
  is_delete: number,
  views: number,
  user: {
    id: number,
    nickname: string,
    avatar: string,
  },
};
