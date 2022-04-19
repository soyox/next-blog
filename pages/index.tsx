import { prepareConnection } from 'db';
import { Article } from 'db/entity';
// import type { NextPage } from 'next';
import ListItem from 'components/ListItem';
import { ArticleType } from './api';
import { Divider } from 'antd';

export async function getServerSideProps() {
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const articles = await articleRepo.find({ relations: ['user'] });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

export interface HomeProps {
  articles: ArticleType[];
}

const Home = (props: HomeProps) => {
  const { articles } = props;
  console.log('home', props.articles);
  return (
    <div className="content-layout">
      {articles.map((article) => (
        <>
          <ListItem key={article.id} article={article}></ListItem>
          <Divider></Divider>
        </>
      ))}
    </div>
  );
};

export default Home;
