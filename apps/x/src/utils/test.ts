import type { TwitterApiTokens } from "twitter-api-v2";
import { Fs } from "@d0paminedriven/fs";
import * as dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";

dotenv.config();

const fs = new Fs(process.cwd());

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY ?? "",
  appSecret: process.env.TWITTER_API_KEY_SECRET ?? "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? ""
} satisfies TwitterApiTokens);
const readonlyClient = client.readOnly;

export const getUserData = async (username: string) => {
  const user = await readonlyClient.v2.user(username, {
    "user.fields": "description,public_metrics"
  });
  // [article,attachments,author_id,card_uri,community_id,context_annotations,conversation_id,created_at,display_text_range,edit_controls,edit_history_tweet_ids,entities,geo,id,in_reply_to_user_id,lang,media_metadata,non_public_metrics,note_tweet,organic_metrics,possibly_sensitive,promoted_metrics,public_metrics,referenced_tweets,reply_settings,scopes,source,text,withheld]'
  const tweets = await readonlyClient.v2.userTimeline(user.data.id, {
    "tweet.fields": "created_at,text,public_metrics",
    max_results: 100
  });
  const nextToken = tweets.meta.next_token;
  const result_count = tweets.meta.result_count;
  tweets.fetchNext(100);
  return {
    profile: user.data,
    tweets: tweets.data.data,
    nextToken,
    result_count,
    userId: user.data.id
  };
};

(async () => {
  return await getUserData("Dopamine_Driven");
})().then(d => {
  console.log(d?.profile ? d.profile : "no profile");
  console.log(d.tweets.length > 0 ? d.tweets.slice(0, 10) : "no tweets");
  fs.withWs("src/utils/__out__/x.data.json", JSON.stringify(d, null, 2));
});
