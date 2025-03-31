import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY ?? "",
  appSecret: process.env.TWITTER_API_KEY_SECRET ?? "",
  accessToken: process.env.TWITTER_ACCESS_TOKEN ?? "",
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? ""
});

export const getUserData = async (username: string) => {
  const user = await client.v2.userByUsername(username, {
    "user.fields": "description,public_metrics"
  });
  const tweets = await client.v2.userTimeline(user.data.id, {
    "tweet.fields": "created_at,text,public_metrics",
    max_results: 100
  });
  return {
    profile: user.data,
    tweets: tweets.data.data
  };
};


getUserData("@Dopamine_Driven");
