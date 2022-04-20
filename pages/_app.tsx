import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import {
  RecoilRoot
} from 'recoil';

function MyApp({ Component, pageProps }: AppProps) {
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps}></Component>;
    } else {
      return (
        <RecoilRoot>
           <Layout>
          <Component {...pageProps} />
        </Layout>
        </RecoilRoot>
       
      );
    }
  };
  return <>{renderLayout()}</>;
}

export default MyApp;
