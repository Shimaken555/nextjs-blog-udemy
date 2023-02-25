import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout, { siteTitle } from "../components/Layout";
import utilStyles from "../styles/utils.module.css";
import { getPostsData } from "../lib/post";

// SSGの場合、静的生成
// getStaticPropsはNext.js側が用意している関数なので名前はしっかり合わせる必要がある。
export async function getStaticProps() {
  const allPostsData = getPostsData();
  // console.log(allPostsData);

  return {
    //getStaticPropsの特有の書き方なのでルールに従う
    props: {
      allPostsData,
    },
  };
}

//SSRの場合
//contextにはユーザーがリクエストした情報が入る
// export async function getServerSideProps(context){
// return {
//   props: {
//     //コンポーネントに渡すためのprops
//   }
// }
// }

// propsで受け取る
export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>今日も元気に生きております。</p>
      </section>

      <section>
        <h2>🗒しまけんブログ</h2>
        <div className={styles.grid}>
          {/* mapマップ関数で展開していく */}
          {allPostsData.map(({ id, title, date, thumbnail }) => (
            <article key={id}>
              <Link href={`/posts/${id}`}>
                <img
                  src={`${thumbnail}`}
                  alt=""
                  className={styles.thumbnailImage}
                />
              </Link>
              <Link href={`/posts/${id}`}>
                <p className={utilStyles.boldText}>{title}</p>
              </Link>
              <br />
              <small className={utilStyles.lightText}>{date}</small>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
