import Head from "next/head";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/GT-Maru-Bold-Trial.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/GT-Maru-Black-Trial.ttf"
          as="font"
          crossOrigin=""
        />
        <meta name="viewport" content="width=device-width" />
        <meta charSet="utf-8" />
        <title>web3 starter</title>
        <meta name="description" content="web3 starter nextjs - shiv" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      {children}
    </>
  );
}
