import type { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './index.module.scss';
import { Button, Input, message } from 'antd';
import request from 'service/fetch'


const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: NextPage = () => {
  const [content, setContent] = useState('**Hello world!!!**');
  const [title, setTitle] = useState('');

  async function handlePublic() {
    
    const res: any = await request.post('/api/article/publish', {
      title,
      content
    })
    if(res?.code === 0){
      message.success('发布成功')
    }else {
      message.error(res?.msg || '发布失败')
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
          发布
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

(NewEditor as any).layout = null;
export default NewEditor;
