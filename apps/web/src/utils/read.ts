// import { PostDetails } from "@/types/posts";
import { Fs } from "@d0paminedriven/fs";
import matter from "gray-matter";
import { omitFrontMatter as _o } from "@/lib/omit-front-matter";

const fs = new Fs(process.cwd());

const post = fs
.fileToBuffer(`src/content/posts/google-analytics-with-nextjs.mdx`)
.toString("utf-8");
// console.log(post);

  const { data: _data, content: content } = matter(post);


  console.log(content);
