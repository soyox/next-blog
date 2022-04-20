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
  comments: CommentType[]
};
  // @PrimaryGeneratedColumn()
  // readonly id!: number

  // @Column()
  // content!: string;

  // @Column()
  // create_time!: Date;

  // @Column()
  // update_time!: Date;

  // @Column()
  // is_delete!: number;

  // @ManyToOne(() => User, {
  //   cascade: true
  // })

  // @JoinColumn({name: 'user_id'})
  // user!: User

  // @ManyToOne(() => Article, {
  //   cascade: true
  // })

  // @JoinColumn({name: 'article_id'}) //外键
  // article!: Article
export type CommentType = {
  id: number,
  content: string,
  create_time: Date,
  update_time: Date,
  is_delete: number,
  user: {
    id: number,
    nickname: string,
    avatar: string,
  },
  article: {
    id: number,
    title: string
  },
};