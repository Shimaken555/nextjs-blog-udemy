import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

//process.cwd(),はルートディレクトリを指している
//postsはpostsその中のpostsフォルダ
const postsDirectory = path.join(process.cwd(), "posts");
console.log(postsDirectory);

//mdファイルのデータを取り出す
export function getPostsData() {
  // const fetchData = await fetch("endpoint")

  const fileNames = fs.readdirSync(postsDirectory); //postsの中にあるファイル群をオブジェクトの配列として返す

  //mapでファイル名を取り出す
  const allPostsData = fileNames.map((fileName) => {
    // idを取得するためにファイル名の拡張子を除外
    const id = fileName.replace(/\.md$/, ""); //ファイル名(id)　、.mdを取り除く

    //マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName); //一つ一つのファイルに対するファイルのパスを取得している
    //ファイルの中身を文字列（文字コードuft8）として読んでいる
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // //matterを使って投稿用のmetaデータを分析する。
    const matterResult = matter(fileContents);

    //idとデータを返す
    return {
      id,
      //matterResultがオブジェクトの配列としてtitleなどが入ってるので、スプレッド構文で展開する
      ...matterResult.data,
    };
  });
  return allPostsData;
}

//getStaticPathでreturnで使うpathを取得する。
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory); //postsの中にあるファイル群をオブジェクトの配列として返す

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
  /* 
[
  { 
  params : {
    id: "ssg-ssr"
  }
 },
 {
    params : {
    id: "next-react"
  }
 }
]
map関数は配列として返すのでこのような構造になる。
*/
}

//idに基づいてブログ投稿データを返す
//どのブログか識別するために引数にidをとる
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`); //一つ一つのファイルに対するファイルのパスを取得している
  const fileContent = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContent);

  //matterResult.content //文字列として読み取るので、マークダウン記法が無視されてしまう
  //npm i remark remark-html でインストールする
  const blogContent = await remark().use(html).process(matterResult.content);

  //string型になおす
  const blogContentHTML = blogContent.toString();
  return {
    id,
    blogContentHTML,
    ...matterResult.data,
  };
}
