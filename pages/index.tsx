import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="/">Wikidata Charts</a>
        </h1>

        <p className={styles.description}>
          Get started by visualizing data{" "}
          <code className={styles.code}>using charts</code>
        </p>

        <div className={styles.grid}>
          <a href="/chart" className={styles.card}>
            <h2>Charts</h2>
            <p>Click here to get the charts</p>
          </a>

          <a href="category/podcast" className={styles.card}>
            <h2>🎙️ Podcasts &rarr;</h2>
            <p>Analyze podcast quests and episode frequency</p>
          </a>

          <a href="category/country" className={styles.card}>
            <h2>🌍 Country &rarr;</h2>
            <p>Analyse country indicators such as life expectancy</p>
          </a>

          <a href="category/country" className={styles.card}>
            <h2>🗳️ Election &rarr;</h2>
            <p>Analyse candidate data.</p>
          </a>
          {/*<a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a> */}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/EntitreeApp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <span className={styles.logo}>CodeLedge</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
