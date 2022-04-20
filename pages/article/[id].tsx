import { Avatar } from 'antd';
import { prepareConnection } from 'db';
import type { NextPage } from 'next';
// import { useRouter } from 'next/router';
import { ArticleType } from 'pages/api';
import styles from './index.module.scss';
import { format } from 'date-fns';
import MarkdownToJSX from 'markdown-to-jsx';
import { Article as ArticleEntity } from 'db/entity';

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(ArticleEntity);
  const article = await articleRepo.findOne({
    where: { id: articleId },
    relations: ['user'],
  });
  if (article) {
    article.views = article.views + 1;
    articleRepo.save(article);
  }
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

export interface ArticleProps {
  article: ArticleType;
}

const Article: NextPage<ArticleProps> = (props) => {
  const { article } = props;
  console.log(article);
  const {
    user: { nickname, avatar, id },
  } = article;
  console.log('id', id);
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
          </div>
        </div>
      </div>
      <MarkdownToJSX className={styles.content}>
        {article.content}
      </MarkdownToJSX>
    </div>
  );
};

export default Article;
