import styles from "./index.module.css";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const About: NextPage = () => {

  return (
    <>
      <Head>
        <title>Woodworking Expense Calculator</title>
        <meta name="description" content="Calculate woodworking expenses and lumber board feet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>About Page</h1>
        <Link href="/">Home</Link>
      </main>
    </>
  );
};

export default About;
