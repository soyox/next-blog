import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps}></Component>;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  return <>{renderLayout()}</>;
}

export default MyApp;
