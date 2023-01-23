import Head from "next/head";
import App from "../components/App";

const Index: React.FC<any> = ({}) => {
  return (
    <>
      <Head>
        <title>Cleric Calculator</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="connect-src ws: wss: https: http:"
        />
      </Head>
      <App />
    </>
  );
};

export default Index;
