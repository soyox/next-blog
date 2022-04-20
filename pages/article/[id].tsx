import { Avatar, Button, Divider, Input, message } from 'antd';
import { prepareConnection } from 'db';
import type { NextPage } from 'next';
// import { useRouter } from 'next/router';
import { ArticleType, CommentType } from 'pages/api';
import styles from './index.module.scss';
import { format } from 'date-fns';
import MarkdownToJSX from 'markdown-to-jsx';
import { Article as ArticleEntity } from 'db/entity';
import {getUserState } from 'store';
import {useRecoilValue } from 'recoil';
import Link from 'antd/lib/typography/Link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import request from 'service/fetch'

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(ArticleEntity);
  // const commentRepo = db.getRepository(Comment)
  const article = await articleRepo.findOne({
    where: { id: articleId },
    relations: ['user', 'comments', 'comments.user'],
  });
  if (article) {
    article.views = article.views + 1;
    articleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      // comments: JSON.parse(JSON.stringify(comments)) || [],
    },
  };
}

export interface ArticleProps {
  article: ArticleType;
  comments: CommentType[];
}

const Article: NextPage<ArticleProps> = (props) => {
  const { article } = props;
  console.log('article', article);

  const {
    user: { nickname, avatar, id },
  } = article;
  const loginUser = useRecoilValue(getUserState);

  const {push} = useRouter()

  const [inputComment, setInputComment] = useState('')

  const [comments, setComments] = useState(article.comments || [])

  function handleEdit() {
    push(`/editor/${article.id}`);
  }

  function handlePublish(){
    request
      .post('/api/comment/publish', {
        comment: inputComment,
        userId: loginUser.userId,
        articleId: article.id
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('发表评论成功')
          const newComments = [
            {
              id: Math.random(),
              create_time: new Date(),
              update_time: new Date(),
              content: inputComment,
              user: {
                avatar: loginUser.avatar,
                nickname: loginUser.nickname,
              }
            },
          ].concat(comments);
          setComments(newComments as CommentType[]);
          setInputComment('')
        }else {
          message.error(`评论发表失败 (${res?.msg})`);
        }
      });
  }
  return (
    <div className="content-layout">
      <h2 className={styles.title}>{article.title}</h2>
      <div className={styles.user}>
        <Avatar src={avatar} size={50}></Avatar>
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>
              {format(new Date(article.update_time), 'yyyy-MM-dd hh:mm:ss')}
            </div>
            <div className={styles.statistics}>阅读 {article.views}</div>
            {loginUser.userId && id == Number(loginUser.userId) ? (
              <div>
                <Link onClick={handleEdit}>编辑</Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <MarkdownToJSX className={styles.content}>
        {article.content}
      </MarkdownToJSX>
      <Divider></Divider>
      <div className={styles.comments}>
        评论
        {loginUser.userId ? (
          <div className={styles.enter}>
            <Avatar src={decodeURIComponent(loginUser.avatar || '')}></Avatar>
            <div className={styles.commentContent}>
              <Input.TextArea
                showCount
                maxLength={100}
                placeholder="请输入评论"
                rows={4}
                value={inputComment}
                onChange={(el) => setInputComment(el.target.value)}
              ></Input.TextArea>
            </div>
            <Button
              disabled={!inputComment}
              onClick={handlePublish}
              className={styles.publishBtn}
              type="primary"
            >
              发表
            </Button>
          </div>
        ) : (
          <p>登陆后发表评论</p>
        )}
        <Divider></Divider>
        <div className={styles.display}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.wrapper}>
              <Avatar src={comment.user?.avatar}></Avatar>
              <div className={styles.info}>
                <div className={styles.name}>
                  <div>{comment.user?.nickname}</div>
                  <div className={styles.date}>
                    {format(
                      new Date(comment.update_time),
                      'yyyy-MM-dd hh:mm:ss'
                    )}
                  </div>
                </div>
                  <div className={styles.content}>{comment.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Article;
