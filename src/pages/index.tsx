import { type NextPage } from "next";
import Head from "next/head";

import { Header } from "~/components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notetaker</title>
        <meta name="description" content="Notetaker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
      </main>
    </>
  );
};
export default Home;
