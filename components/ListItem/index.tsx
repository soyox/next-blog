import { EyeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import type { NextPage } from 'next';
import Link from 'next/link';
import { ArticleType } from 'pages/api';
import styles from './index.module.scss';
import { formatDistanceToNow } from 'date-fns';
import { markdownToTxt } from 'markdown-to-txt';

export interface ListItemProps {
  article: ArticleType;
}
const ListItem: NextPage<ListItemProps> = (props) => {
  const { article } = props;
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>
          <div className={styles.userInfo}>
            <span className={styles.name}>{article.user?.nickname}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(article.update_time))}
            </span>
          </div>
          <h4 className={styles.title}>{article.title}</h4>
          <p className={styles.content}>{markdownToTxt(article.content)}</p>
          <div className={styles.statistics}>
            <EyeOutlined></EyeOutlined>
            <span>{article.views}</span>
          </div>
        </div>
        <Avatar src={article.user?.avatar}></Avatar>
      </div>
    </Link>
  );
};

export default ListItem;
