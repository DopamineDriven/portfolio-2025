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

export const getUserData = async (userId: string) => {
  const user = await readonlyClient.v2.user("Dopamine_Driven", {
    "user.fields": "description,public_metrics"
  });
  user.data;
  // [article,attachments,author_id,card_uri,community_id,context_annotations,conversation_id,created_at,display_text_range,edit_controls,edit_history_tweet_ids,entities,geo,id,in_reply_to_user_id,lang,media_metadata,non_public_metrics,note_tweet,organic_metrics,possibly_sensitive,promoted_metrics,public_metrics,referenced_tweets,reply_settings,scopes,source,text,withheld]'
  const tweets = await readonlyClient.v2.userTimeline(userId, {
    "tweet.fields": "created_at,text,public_metrics",
    pagination_token: "7140dibdnow9c7btw3t4lew82gfba23nwkq43nnwru8mx",
    max_results: 100
  });
  const previousToken = tweets.meta.previous_token ?? null;
  const nextToken = tweets.meta.next_token ?? null;
  const result_count = tweets.meta.result_count;
  return {
    // profile: user.data,
    tweets: tweets.data.data,
    previousToken,
    nextToken,
    result_count,
    userId
  };
};

(async () => {
  return await getUserData("989610823105568769");
})().then(d => {
  console.log(d.nextToken);
  fs.withWs(`src/utils/__out__/33.json`, JSON.stringify(d, null, 2));
});
