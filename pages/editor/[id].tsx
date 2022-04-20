import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './index.module.scss';
import { Button, Input, message } from 'antd';
import request from 'service/fetch'
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import { ArticleType } from 'pages/api';
import { useRouter } from 'next/router';

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db.getRepository(Article);
  const article = await articleRepo.findOne({
    where: { id: articleId },
    relations: ['user'],
  });
  // if (article) {
  //   article.views = article.views + 1;
  //   articleRepo.save(article);
  // }
  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

export interface ModifyEditorProps{
  article: ArticleType
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const ModifyEditor: NextPage<ModifyEditorProps> = (props) => {
  const {article} = props
  const [content, setContent] = useState(article.content || '');
  const [title, setTitle] = useState(article.title || '');
  
  const {replace} = useRouter()
  async function handlePublic() {
    
    const res: any = await request.post(`/api/article/update`, {
      title,
      content,
      id: article.id
    })
    if(res?.code === 0){
      message.success('更新成功')
      replace(`/article/${article.id}`)
    }else {
      message.error(res?.msg || '更新失败')
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={(el) => setTitle(el.target.value)}
        ></Input>
        <Button disabled={!title || !content} onClick={handlePublic} type="primary">
          更新
        </Button>
      </div>
      <MDEditor
        height={1080}
        value={content}
        onChange={(value = '') => setContent(value)}
      />
    </div>
  );
};

(ModifyEditor as any).layout = null;
export default ModifyEditor;
