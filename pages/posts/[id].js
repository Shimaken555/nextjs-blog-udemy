import Head from "next/head";
import Layout from "../../components/Layout";
import { getAllPostIds, getPostData } from "../../lib/post";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
    //fallback: falseにするとpathsに含まれてないpathsにアクセスすると404になる。
    //trueにすると開発環境だとエラーを吐く。存在しないパスでも動的にページを生成できる。useRouterでページ生成する。
  };
}

export async function getStaticProps({ params }) {
  // 個別のidを取得できる
  const postData = await getPostData(params.id);

  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  console.log(postData);
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>{postData.date}</div>
        {/* dangerouslySetInnerHTMLは危険性があるので、しっかりサニタリングして使う */}
        <div dangerouslySetInnerHTML={{ __html: postData.blogContentHTML }} />
      </article>
    </Layout>
  );
}
