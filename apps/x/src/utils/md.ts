import type { TweetV2, UserV2 } from "twitter-api-v2";
import { Fs } from "@d0paminedriven/fs";

export type JSONDATA = {
  profile: UserV2;
  tweets: Pick<
    TweetV2,
    "public_metrics" | "edit_history_tweet_ids" | "id" | "created_at" | "text"
  >[];
};

const fs = new Fs(process.cwd());

const getTweets = JSON.parse(
  fs.fileToBuffer("src/utils/__out__/final/tweets.json").toString("utf-8")
) as JSONDATA;

function mapIt(file: JSONDATA) {
  const fs = new Fs(process.cwd());
  const helper = Array.of<string>();
  const _profile = {
    public_metrics: {
      followers_count: 550,
      following_count: 1249,
      tweet_count: 3549,
      listed_count: 3,
      like_count: 9174,
      media_count: 505
    },
    id: "989610823105568769",
    username: "Dopamine_Driven",
    description: "JAMstack Development Lead at Takeda | TypeScript is 💙",
    name: "Andrew Ross"
  } satisfies UserV2;

  try {
    return file.tweets.forEach(function (tweet, i) {
      // prettier-ignore
      if (!tweet.public_metrics) return;
      const {
        impression_count,
        like_count,
        quote_count,
        reply_count,
        retweet_count,
        bookmark_count
      } = tweet.public_metrics;
      const formatIt = `- tweet:
  - id: "${tweet.id}"
  - created_at: "${tweet.created_at ?? ""}"
  - edit_history_tweet_id: ["${tweet.edit_history_tweet_ids[0]}"]
  - tweetNo: ${i++}
  - public_metrics:
    - impression_count: ${impression_count ?? 0}
    - like_count: ${like_count ?? 0}
    - quote_count: ${quote_count ?? 0}
    - reply_count: ${reply_count ?? 0}
    - retweet_count: ${retweet_count ?? 0}
    - bookmark_count: ${bookmark_count ?? 0}
  - text: "${tweet.text}"
`;
      helper.push(formatIt);
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else console.error(err);
  } finally {
    // prettier-ignore
    const tweetArr = `- tweets:
  ${helper.join("\n")}`
    fs.withWs("src/utils/__out__/final/to-yaml.yaml", tweetArr);
  }
}

mapIt(getTweets);

/**
    {
      "created_at": "2021-03-25T02:19:01.000Z",
      "text": "@JennyMaMTL Have you seen the Heist on Netflix? I don't know why but I have a feeling you'd enjoy it",
      "public_metrics": {
        "retweet_count": 0,
        "reply_count": 1,
        "like_count": 1,
        "quote_count": 0,
        "bookmark_count": 0,
        "impression_count": 0
      },
      "edit_history_tweet_ids": [
        "1374908652100984834"
      ],
      "id": "1374908652100984834"
    },
 */
